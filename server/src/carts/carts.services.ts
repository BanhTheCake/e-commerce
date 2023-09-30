import {
  ADD_TO_CART_ROUTE,
  DELETE_CART_ITEM_ROUTE,
  GET_CART_ITEM_ROUTE,
  PAYMENT_ROUTE,
  UPDATE_CART_ROUTE,
} from '@/constant/cart.constant';
import { CartItems, Carts, Products } from '@/entities';
import { ProductsService } from '@/products/products.service';
import { RedisServices } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { DataSource, Repository } from 'typeorm';
import { AddToDto } from './dto/add.dto';
import { DeleteDto } from './dto/delete.dto';
import { PaymentDto } from './dto/payment.dto';
import { UpdateDto } from './dto/update.dto';
import { CreateHistoryQueue, HistoryItem } from './queue/create-history.queue';

const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

type CartItem = HistoryItem & {
  stock: number;
  id: string;
};

@Injectable()
export class CartsServices {
  constructor(
    @InjectRepository(Carts) private cartsRepository: Repository<Carts>,
    @InjectRepository(CartItems)
    private cartItemsRepository: Repository<CartItems>,
    @InjectQueue('carts') private cartsQueue: Queue,
    private dataSource: DataSource,
    private redisServices: RedisServices,
    @Inject(forwardRef(() => ProductsService))
    private productServices: ProductsService,
  ) {}

  helpers = {
    startTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
    create: (data: Partial<Carts>) => this.cartsRepository.create(data),
    createQueryBuilder: {
      cart: (alias: string) => this.cartsRepository.createQueryBuilder(alias),
      cartItem: (alias: string) =>
        this.cartItemsRepository.createQueryBuilder(alias),
    },
  };

  // ========= FOR ROUTE ==========

  async addToCart(data: AddToDto) {
    const { productId, quantity, cartId } = data;
    const product = await this.productServices.helpers.createQueryBuilder
      .product('products')
      .where('products.id = :id', { id: productId })
      .select(['products.id', 'products.quantity'])
      .getOne();
    if (!product) {
      throw new BadRequestException(ADD_TO_CART_ROUTE.PRODUCT_NOT_FOUND);
    }
    let cartItem = await this.cartItemsRepository.findOne({
      where: { cartId, productId },
    });
    if (!cartItem) {
      cartItem = this.cartItemsRepository.create({
        cartId,
        productId,
        quantity,
      });
    } else {
      cartItem.quantity = cartItem.quantity + quantity;
    }
    const isOutOfStock = cartItem.quantity > product.quantity;
    if (isOutOfStock) {
      throw new BadRequestException(ADD_TO_CART_ROUTE.OUT_OF_STOCK);
    }
    await this.cartItemsRepository.save(cartItem);
    return {
      errCode: 0,
      message: ADD_TO_CART_ROUTE.SUCCESS,
      data: cartItem,
    };
  }

  async updateCart(data: UpdateDto) {
    const { productId, quantity, cartId } = data;
    const cartItem = await this.cartItemsRepository.findOne({
      where: { cartId, productId },
      relations: {
        product: true,
      },
    });
    if (!cartItem) {
      throw new BadRequestException(
        UPDATE_CART_ROUTE.PRODUCT_NOT_FOUND(productId),
      );
    }

    if (quantity > cartItem.product.quantity) {
      throw new BadRequestException(UPDATE_CART_ROUTE.OUT_OF_STOCK(productId));
    }

    if (quantity === 0) {
      await this.cartItemsRepository.remove(cartItem);
    } else {
      cartItem.quantity = quantity;
      await this.cartItemsRepository.save(cartItem);
    }
    return {
      errCode: 0,
      message: UPDATE_CART_ROUTE.SUCCESS,
    };
  }

  async deleteCart(data: DeleteDto) {
    const { cartItems: cartItemIds, cartId } = data;
    const cartItems = [];
    for (const cartItemId of cartItemIds) {
      const cartItem = await this.cartItemsRepository.findOne({
        where: { id: cartItemId, cartId },
      });
      if (cartItem) {
        cartItems.push(cartItem);
      }
    }
    await this.cartItemsRepository.remove(cartItems);
    return {
      errCode: 0,
      message: DELETE_CART_ITEM_ROUTE.SUCCESS,
    };
  }

  async getCartItems(userId: string) {
    const cart = await this.cartsRepository
      .createQueryBuilder('carts')
      .leftJoinAndSelect('carts.cartItems', 'cartItems')
      .leftJoinAndSelect('cartItems.product', 'products')
      .select([
        'carts',
        'cartItems',
        'products.id',
        'products.created_at',
        'products.updated_at',
        'products.label',
        'products.slug',
        'products.price',
        'products.quantity',
        'products.star',
      ])
      .where('carts.userId = :userId', { userId })
      .getOne();
    return {
      errCode: 0,
      message: GET_CART_ITEM_ROUTE.SUCCESS,
      data: cart,
    };
  }

  async payment(data: PaymentDto, userId: string) {
    const { cartId, items } = data;
    let total = 0;
    const historyItems: HistoryItem[] = [];
    const cartItems: CartItem[] = [];
    for (const item of items) {
      const cartItem = await this.cartItemsRepository.findOne({
        where: {
          productId: item.productId,
          cartId: cartId,
        },
        relations: {
          product: true,
        },
      });
      if (!cartItem) {
        throw new BadRequestException(
          PAYMENT_ROUTE.PRODUCT_NOT_FOUND(item.productId),
        );
      }
      cartItems.push({
        ...item,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        stock: cartItem.product.quantity,
        id: cartItem.id,
      });
    }
    for (const cartItem of cartItems) {
      // create key quantity in redis
      await this.redisServices.setnx(
        'product:quantity:' + cartItem.productId,
        cartItem.stock,
      );

      // check is exceed product quantity in stock
      const remainAmount = await this.redisServices.incrBy(
        'product:quantity:' + cartItem.productId,
        cartItem.quantity * -1,
      );
      if (remainAmount < 0) {
        throw new BadRequestException(
          PAYMENT_ROUTE.OUT_OF_STOCK(cartItem.productId),
        );
      }
      total = total + cartItem.price * cartItem.quantity;
      const historyItem: HistoryItem = {
        price: cartItem.price,
        quantity: cartItem.quantity,
        productId: cartItem.productId,
      };
      historyItems.push(historyItem);
    }
    // payment ....
    await delay(2000);

    const queryRunner = await this.helpers.startTransaction();
    try {
      // update stock product
      for (const cartItem of cartItems) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Products)
          .set({
            quantity: () => `quantity - :quantity`,
          })
          .setParameters({
            quantity: cartItem.quantity,
          })
          .where('id = :id', { id: cartItem.productId })
          .execute();
      }

      // update cart items in redis
      const cartItemDelete = cartItems.map((cartItem) => {
        return this.cartItemsRepository.create({
          id: cartItem.id,
        });
      });
      await queryRunner.manager.getRepository(CartItems).remove(cartItemDelete);

      // create history
      await this.cartsQueue.add(
        'history',
        new CreateHistoryQueue(userId, total, historyItems),
      );
      await queryRunner.commitTransaction();
      return {
        errCode: 0,
        message: PAYMENT_ROUTE.SUCCESS,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      for (const item of items) {
        await this.redisServices.del('product:quantity:' + item.productId);
      }
    }
  }
}
