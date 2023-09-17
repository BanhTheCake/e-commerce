import { Carts } from '@/entities/cart.entity';
import { CartItems } from '@/entities/cartItem.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AddToDto } from './dto/add.dto';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class CartsServices {
  constructor(
    @InjectRepository(Carts) private cartsRepository: Repository<Carts>,
    @InjectRepository(CartItems)
    private cartItemsRepository: Repository<CartItems>,
    private dataSource: DataSource,
  ) {}

  createEntity(data: Partial<Carts>) {
    return this.cartsRepository.create(data);
  }

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async addToCart(data: AddToDto, userId: string) {
    const queryRunner = await this.startTransaction();
    try {
      const { productId, quantity } = data;
      let cart = await this.cartsRepository.findOne({
        where: { userId },
      });
      if (!cart) {
        cart = this.createEntity({ userId });
        await queryRunner.manager.getRepository(Carts).save(cart);
      }
      let cartItem = await this.cartItemsRepository.findOne({
        where: { cartId: cart.id, productId },
      });
      if (!cartItem) {
        cartItem = this.cartItemsRepository.create({
          cartId: cart.id,
          productId,
          quantity,
        });
      } else {
        cartItem.quantity = quantity;
      }
      await queryRunner.manager.getRepository(CartItems).save(cartItem);
      await queryRunner.commitTransaction();
      return {
        errCode: 0,
        message: 'Add to cart successfully',
        data: cartItem,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    } finally {
      await queryRunner.release();
    }
  }

  async updateCart(data: UpdateDto) {
    const queryRunner = await this.startTransaction();
    try {
      const { cartId, cartItems } = data;
      const cart = await this.cartsRepository.findOne({
        where: { id: cartId },
      });
      if (!cart) {
        throw new BadRequestException('Cart not found');
      }
      const removeEntities = [];
      const updateEntities = [];
      for (const cartItem of cartItems) {
        const { productId, quantity } = cartItem;
        const cartItemEntity = await this.cartItemsRepository.findOne({
          where: { cartId, productId },
        });
        if (!cartItemEntity) {
          throw new BadRequestException(
            `item with id ${cartItem.productId} not found`,
          );
        }
        if (quantity === 0) {
          removeEntities.push(cartItemEntity);
        } else {
          cartItemEntity.quantity = quantity;
          updateEntities.push(cartItemEntity);
        }
      }
      await queryRunner.manager.getRepository(CartItems).remove(removeEntities);
      await queryRunner.manager.getRepository(CartItems).save(updateEntities);
      await queryRunner.commitTransaction();
      return {
        errCode: 0,
        message: 'Update cart successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    } finally {
      await queryRunner.release();
    }
  }

  async getCartItems(userId: string) {
    try {
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
      return cart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
