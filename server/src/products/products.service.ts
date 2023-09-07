import { Products, Users } from '@/entities';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateNewDto } from './dto/create-new.dto';
import { slugifyFn } from '@/utils/slugify';
import { CategoriesService } from '@/categories/categories.service';
import { Products_Categories } from '@/entities/products-categories.entity';
import { omit, isEmpty } from 'lodash';
import { ProductResponse } from './dto/product.response';
import { ImagesService } from '@/images/images.service';
import { GetOneParamDto } from './dto/get-one-param.dto';
import { DeleteDto } from './dto/delete.dto';
import { UpdateBodyDto, UpdateParamDto } from './dto/update.dto';
import { GetAllQueryDto, ORDER } from './dto/get-all.dto';
import { IPagination } from '@/response/pagination';
import { paginationFn } from '@/utils/pagination';
import {
  CREATE_PRODUCT_ROUTE,
  DELETE_PRODUCT_ROUTE,
  GET_PRODUCT_ROUTE,
  UPDATE_PRODUCT_ROUTE,
} from '@/constant/product.constant';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Products_Categories)
    private readonly productsCategoriesRepository: Repository<Products_Categories>,
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService,
    private dataSource: DataSource,
  ) {}

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  serializeProduct(product: Products) {
    let result: ProductResponse = {
      ...omit(product, ['productCategory']),
      categories: [],
    };
    if (product?.productCategory && product?.productCategory?.length > 0) {
      const categories = product.productCategory.map((item) => {
        return item.category;
      });
      result = { ...result, categories };
    }
    return result;
  }

  // leftJoinAndSelect('products.productCategory', 'products_categories')
  // leftJoinAndSelect('entity.nameRelation', 'nameWhateverYouWant')
  async getOne(id: string) {
    // return this.productsRepository.findOne({
    //   where: { id },
    //   relations: {
    //     productCategory: {
    //       category: true,
    //     },
    //   },
    // });
    const product = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.productCategory', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'categories')
      .leftJoinAndSelect('products.images', 'images')
      .where('products.id = :id', { id })
      .getOne();
    if (!product) {
      throw new BadRequestException('Product not found!');
    }
    return this.serializeProduct(product);
  }

  async createNew(
    data: CreateNewDto,
    user: Users,
    files: Array<Express.Multer.File>,
  ) {
    const queryRunner = await this.startTransaction();
    try {
      const { label, categories: categoriesId } = data;
      const slug = slugifyFn(label);
      const existingProduct = await this.productsRepository.findOne({
        where: [{ label }, { slug }],
      });
      if (existingProduct) {
        throw new BadRequestException(CREATE_PRODUCT_ROUTE.EXIST_LABEL);
      }
      const categories = await this.categoriesService.validateCategories(
        categoriesId,
      );
      // Add transaction
      const newProduct = this.productsRepository.create({
        ...data,
        slug,
        ownerId: user.id,
      });
      await queryRunner.manager.save(newProduct);
      const newProductsCategories = categories.map((category) => ({
        productId: newProduct.id,
        categoryId: category.id,
      }));
      const newProductsCategoriesEntity =
        this.productsCategoriesRepository.create(newProductsCategories);
      await Promise.all([
        this.imagesService.uploadImages(files, newProduct, queryRunner),
        queryRunner.manager.save(newProductsCategoriesEntity),
      ]);
      await queryRunner.commitTransaction();
      const result = await this.getOne(newProduct.id);
      return {
        errCode: 0,
        message: CREATE_PRODUCT_ROUTE.SUCCESS,
        data: result,
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

  // For route get by id
  async findOne({ id }: GetOneParamDto) {
    try {
      const data = await this.getOne(id);
      return {
        errCode: 0,
        message: GET_PRODUCT_ROUTE.SUCCESS(id),
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  // Soft delete
  async deleteOne({ id }: DeleteDto) {
    try {
      const currentProduct = await this.productsRepository.findOne({
        where: { id },
      });
      if (!currentProduct) {
        throw new BadRequestException(DELETE_PRODUCT_ROUTE.NOT_FOUND);
      }
      await this.productsRepository.softRemove(currentProduct);
      return {
        errCode: 0,
        message: DELETE_PRODUCT_ROUTE.SUCCESS(id),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async updateOne(
    { id }: UpdateParamDto,
    data: UpdateBodyDto,
    files: Array<Express.Multer.File>,
  ) {
    const queryRunner = await this.startTransaction();
    try {
      let currentProduct = await this.productsRepository.findOne({
        where: { id },
      });
      if (!currentProduct) {
        throw new BadRequestException(UPDATE_PRODUCT_ROUTE.NOT_FOUND);
      }
      const slug = slugifyFn(data.label ?? currentProduct.label);
      currentProduct = {
        ...currentProduct,
        ...omit(data, ['filesId', 'categoriesId']),
        slug,
      };
      await queryRunner.manager.getRepository(Products).save(currentProduct);
      // Modify categories
      if (data.categoriesId) {
        const prevCategoryEntities =
          await this.productsCategoriesRepository.find({
            where: { productId: currentProduct.id },
          });
        const newCategories = data.categoriesId.map<
          Partial<Products_Categories>
        >((id) => {
          return {
            productId: currentProduct.id,
            categoryId: id,
          };
        });
        const newCategoryEntities =
          this.productsCategoriesRepository.create(newCategories);
        await Promise.all([
          queryRunner.manager.remove(prevCategoryEntities),
          queryRunner.manager.save(newCategoryEntities),
        ]);
      }
      // List Id files that need to be deleted
      if (data.filesId) {
        await this.imagesService.deleteFiles(data.filesId, queryRunner);
      }
      // Upload new images
      if (!isEmpty(files)) {
        await this.imagesService.uploadImages(
          files,
          currentProduct,
          queryRunner,
        );
      }
      await queryRunner.commitTransaction();
      const result = await this.getOne(currentProduct.id);
      return {
        errCode: 0,
        message: UPDATE_PRODUCT_ROUTE.SUCCESS,
        data: result,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    } finally {
      queryRunner.release();
    }
  }

  async findAll(query: GetAllQueryDto): Promise<IPagination<any>> {
    try {
      const {
        limit,
        page,
        order = ORDER.ASC,
        sortBy = 'label',
        value = 1,
        category = '',
      } = query;
      const offset = limit * (page - 1);
      const productsBuilder = this.productsRepository
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.productCategory', 'productCategory')
        .leftJoinAndSelect('productCategory.category', 'categories')
        .leftJoinAndSelect('products.images', 'images')
        .skip(offset)
        .take(limit)
        .orderBy(`products.${sortBy}`, order);

      if (sortBy === 'star') {
        productsBuilder.where('products.star >= :star', { star: value });
      }

      if (category) {
        productsBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('productCategory.productId')
            .from(Products_Categories, 'productCategory')
            .leftJoin('productCategory.category', 'category')
            .where('category.slug = :slug', { slug: category })
            .getQuery();
          return 'products.id IN ' + subQuery;
        });
      }

      const [products, productsCount] = await productsBuilder.getManyAndCount();

      const { total, hasNextPage, hasPrevPage, pages } = paginationFn({
        limit,
        page,
        total: productsCount,
      });
      const data = products.map((product) => this.serializeProduct(product));
      return {
        limit,
        page,
        total,
        pages,
        hasNextPage,
        hasPrevPage,
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
