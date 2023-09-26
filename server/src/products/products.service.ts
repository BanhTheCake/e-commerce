import { Images, Products, Users } from '@/entities';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreateNewDto } from './dto/create-new.dto';
import { slugifyFn } from '@/utils/slugify';
import { CategoriesService } from '@/categories/categories.service';
import { Products_Categories } from '@/entities/products-categories.entity';
import { omit, isEmpty, isEqual, cloneDeep, pickBy, pick } from 'lodash';
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
  SUGGEST_ROUTE,
  UPDATE_PRODUCT_ROUTE,
} from '@/constant/product.constant';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';
import { SuggestDto } from './dto/suggest.dto';
import {
  QueryDslQueryContainer,
  Sort,
} from '@elastic/elasticsearch/lib/api/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from '@/users/users.service';
import { GetRelativesDto } from './dto/get-relatives.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Products_Categories)
    private readonly productsCategoriesRepository: Repository<Products_Categories>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService,
    private readonly elasticService: ElasticSearchService,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
    private dataSource: DataSource,
  ) {}

  helpers = {
    createQueryBuilder: {
      product: (alias) => this.productsRepository.createQueryBuilder(alias),
      productCategory: (alias) =>
        this.productsCategoriesRepository.createQueryBuilder(alias),
    },
    starTransaction: async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    },
    bulkInsert: {
      product: async (productList: Partial<Products>[]) => {
        const productEntities = this.productsRepository.create(productList);
        return await this.productsRepository.save(productEntities);
      },
      productCategory: async (
        productCategoryList: Partial<Products_Categories>[],
      ) => {
        const productCategoryEntities =
          this.productsCategoriesRepository.create(productCategoryList);
        return await this.productsCategoriesRepository.save(
          productCategoryEntities,
        );
      },
    },
    save: {
      product: async (product: Partial<Products>) => {
        return await this.productsRepository.save(product);
      },
      productCategory: async (
        productCategory: Partial<Products_Categories>,
      ) => {
        return await this.productsCategoriesRepository.save(productCategory);
      },
    },
  };

  private serializeProduct(product: Products) {
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

  private handleQuery(
    q: string,
    input: QueryDslQueryContainer,
  ): QueryDslQueryContainer {
    if (!q) {
      return {
        match_all: {},
      };
    }
    return input;
  }

  // leftJoinAndSelect('products.productCategory', 'products_categories')
  // leftJoinAndSelect('entity.nameRelation', 'nameWhateverYouWant')
  private async getOne(id: string) {
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

  // ========== FOR ROUTE ==========

  async createNew(
    data: CreateNewDto,
    user: Users,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const { label, categories: categoriesId } = data;
      const slug = slugifyFn(label);
      const existingProduct = await this.productsRepository.findOne({
        where: [{ label }, { slug }],
      });
      if (existingProduct) {
        throw new BadRequestException(CREATE_PRODUCT_ROUTE.EXIST_LABEL);
      }
      const categories = await this.categoriesService.helpers.validate(
        categoriesId,
      );
      const newProduct = this.productsRepository.create({
        ...data,
        slug,
        ownerId: user.id,
      });

      // Add transaction
      const queryRunner = await this.helpers.starTransaction();
      try {
        await queryRunner.manager.save(newProduct);
        const newProductsCategories = categories.map((category) => ({
          productId: newProduct.id,
          categoryId: category.id,
        }));
        const newProductsCategoriesEntity =
          this.productsCategoriesRepository.create(newProductsCategories);
        await Promise.all([
          this.imagesService.helpers.upload.multi(
            files,
            newProduct,
            queryRunner,
          ),
          queryRunner.manager.save(newProductsCategoriesEntity),
        ]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

      const result = await this.getOne(newProduct.id);
      await this.elasticService.createNewDoc<ProductResponse>({
        index: 'products',
        id: result.id,
        document: result,
      });
      return {
        errCode: 0,
        message: CREATE_PRODUCT_ROUTE.SUCCESS,
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async findOne({ id }: GetOneParamDto) {
    try {
      const cache = await this.cacheManager.get<ProductResponse>(
        `product:${id}`,
      );
      if (cache) {
        return {
          errCode: 0,
          message: GET_PRODUCT_ROUTE.SUCCESS(id),
          data: cache,
          cache: true,
        };
      }
      const data = await this.getOne(id);
      await this.cacheManager.set(`product:${id}`, data);
      return {
        errCode: 0,
        message: GET_PRODUCT_ROUTE.SUCCESS(id),
        data,
        cache: false,
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
      await this.elasticService.deleteDoc({ index: 'products', id });
      await this.cacheManager.del(`product:${id}`);
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
    const queryRunner = await this.helpers.starTransaction();
    try {
      let currentProduct = await this.getOne(id);
      const copyCurrentProduct = cloneDeep(currentProduct);
      if (!currentProduct) {
        throw new BadRequestException(UPDATE_PRODUCT_ROUTE.NOT_FOUND);
      }
      const slug = slugifyFn(data.label ?? currentProduct.label);
      currentProduct = {
        ...currentProduct,
        ...omit(data, ['filesId', 'categoriesId']),
        slug,
      };
      try {
        await queryRunner.manager.getRepository(Products).save(currentProduct);
        // Modify categories
        if (data.categoriesId) {
          const deleteCategoriesEntity =
            await this.productsCategoriesRepository.find({
              where: { productId: currentProduct.id },
            });
          // Clone array with 2 properties [categoryId, productId]
          const deleteCategories = deleteCategoriesEntity.map((item) => {
            return pick(item, ['categoryId', 'productId']);
          });

          const newCategories = data.categoriesId.map<
            Partial<Products_Categories>
          >((id) => {
            return {
              productId: currentProduct.id,
              categoryId: id,
            };
          });

          // Check if new categoryIds is equal to delete categoryIds
          // if true then not delete and not create new
          if (!isEqual(newCategories, deleteCategories)) {
            // get equal value between delete categories and new categories
            const equalValueCategories = deleteCategories
              .filter((category) =>
                data.categoriesId.includes(category.categoryId),
              )
              .map((category) => category.categoryId);

            // create category that not exist in equalValueCategories
            const categoriesCreate = newCategories.filter((category) => {
              return !equalValueCategories.includes(category.categoryId);
            });

            // delete category that not exist in equalValueCategories
            const categoriesRemove = deleteCategoriesEntity.filter(
              (category) => {
                return !equalValueCategories.includes(category.categoryId);
              },
            );

            /* Example: 
              newCategories = [{categoryId: 1}, {categoryId: 2}]
              deleteCategories = [{categoryId: 1}, {categoryId: 3}]
              [CREATE] => category need to be create = {categoryId: 2}
              [DELETE] =>  category need to be delete = {category: 3}
              [NOTHING] => {categoryId: 1} is do nothing (because it exist in delete and create)
            */

            const newCategoryEntities =
              this.productsCategoriesRepository.create(categoriesCreate);

            // if categoriesCreate is empty then not save
            !isEmpty(categoriesCreate) &&
              queryRunner.manager.save(newCategoryEntities);

            // if categoriesRemove is empty then not delete
            !isEmpty(categoriesRemove) &&
              queryRunner.manager.remove(categoriesRemove);
          }
        }
        // List Id files that need to be deleted
        if (data.filesId) {
          const imagesDelete = await this.imagesService.helpers
            .createQueryBuilder('image')
            .where('image.id IN (:...ids)', { ids: data.filesId })
            .getMany();
          await queryRunner.manager.getRepository(Images).remove(imagesDelete);
        }
        // Upload new images
        if (!isEmpty(files)) {
          await this.imagesService.helpers.upload.multi(
            files,
            currentProduct,
            queryRunner,
          );
        }
        await this.cacheManager.del('product:' + id);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        queryRunner.release();
      }
      const result = await this.getOne(currentProduct.id);

      // Get difference value between two objects
      const changes = pickBy(
        result,
        (v, k) => !isEqual(copyCurrentProduct[k], v),
      );
      await this.elasticService.updateDoc({
        index: 'products',
        id: result.id,
        doc: changes,
      });

      return {
        errCode: 0,
        message: UPDATE_PRODUCT_ROUTE.SUCCESS,
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async findAll(query: GetAllQueryDto): Promise<IPagination<any>> {
    try {
      const {
        limit,
        page,
        order = ORDER.ASC,
        sortBy = 'label',
        value: star,
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

      if (star) {
        productsBuilder.where('products.star = :star', { star });
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

  async autoSuggest({ q, limit = 10 }: SuggestDto) {
    try {
      const elasticResult = await this.elasticService.search<ProductResponse>({
        _source: {
          include: ['id', 'label'],
        },
        index: 'products',
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  'label.startWith': {
                    query: q,
                  },
                },
              },
              {
                match: {
                  label: {
                    query: q,
                    operator: 'and',
                  },
                },
              },
              {
                match: {
                  'label.normalize': {
                    query: q,
                    operator: 'and',
                  },
                },
              },
            ],
          },
        },
        size: limit,
      });
      const result = elasticResult.hits.hits.map((item) => {
        return {
          id: item._source.id,
          query: item._source.label,
        };
      });
      return {
        errCode: 0,
        message: SUGGEST_ROUTE.SUCCESS,
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async findAllElastic(query: GetAllQueryDto) {
    try {
      const {
        limit,
        page,
        order = ORDER.ASC,
        sortBy = '',
        value: star,
        category = '',
        q = '',
      } = query;
      const offset = limit * (page - 1);

      const keyCache = `products:${slugifyFn(
        q,
      )}:${limit}:${page}:${order}:${sortBy}:${star || ''}:${category}`;
      const cache = await this.cacheManager.get<{
        total: number;
        data: ProductResponse[];
      }>(keyCache);

      let total = 0;
      let data = null;
      let isCache = false;

      if (cache) {
        total = cache.total;
        data = cache.data;
        isCache = true;
      } else {
        const sort: Sort = sortBy
          ? [
              {
                [sortBy]: {
                  order: order === 'DESC' ? 'desc' : 'asc',
                },
              },
            ]
          : [];

        let filter: QueryDslQueryContainer[] = [];
        const must: QueryDslQueryContainer[] = [
          this.handleQuery(q, {
            multi_match: {
              query: q,
              operator: 'and',
              fields: ['label^2', 'label.normalize'],
            },
          }),
        ];
        const should: QueryDslQueryContainer[] = [
          this.handleQuery(q, {
            match_phrase: {
              'label.autocomplete': {
                query: q,
                slop: 10,
                // https://www.youtube.com/watch?v=V1Eo429iS9c
              },
            },
          }),
        ];

        if (star) {
          filter = [{ term: { star } }];
        }

        if (category) {
          filter = [
            ...filter,
            {
              nested: {
                path: 'categories',
                query: {
                  bool: {
                    filter: [
                      {
                        term: {
                          'categories.slug': category,
                        },
                      },
                    ],
                  },
                },
              },
            },
          ];
        }
        const elasticCount = await this.elasticService.count({
          index: 'products',
          query: {
            bool: {
              must: must,
              filter: filter,
            },
          },
        });
        const elasticResult = await this.elasticService.search<ProductResponse>(
          {
            index: 'products',
            _source: {
              exclude: ['description'],
            },
            query: {
              bool: {
                must: must,
                should: should,
                filter: filter,
              },
            },
            sort,
            from: offset,
            size: limit,
          },
        );

        total = elasticCount.count;
        data = elasticResult.hits.hits.map((productSource) => {
          return productSource._source;
        });
        await this.cacheManager.set(keyCache, {
          total,
          data,
        });
      }

      const { hasNextPage, hasPrevPage, pages } = paginationFn({
        limit,
        page,
        total,
      });

      return {
        limit,
        page,
        total,
        pages,
        hasNextPage,
        hasPrevPage,
        data,
        cache: isCache,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async findAllRelative(data: GetRelativesDto) {
    try {
      const { userId, page, limit } = data;
      const offset = limit * (page - 1);
      let followerIds = [];
      let must_not: QueryDslQueryContainer[] = [];
      let total = 0;
      let rs = null;
      let isCache = false;

      const keyCache = `products:${limit}:${page}:${userId}`;
      const cache = await this.cacheManager.get<{
        total: number;
        data: ProductResponse[];
      }>(keyCache);

      if (cache) {
        total = cache.total;
        rs = cache.data;
        isCache = true;
      } else {
        if (userId) {
          const followers = await this.userServices.helpers.createQueryBuilder
            .follow('follow')
            .where('follow.userId = :id', { id: userId })
            .select(['follow.followingId', 'follow.userId'])
            .orderBy('follow.created_at', 'DESC')
            .take(10)
            .getMany();
          followerIds = followers.map((follower) => {
            return follower.followingId;
          });
          must_not = [{ term: { ownerId: userId } }];
        }
        const elasticCount = await this.elasticService.count({
          index: 'products',
          query: {
            bool: {
              must: [{ match_all: {} }],
              must_not: must_not,
            },
          },
        });
        const elasticResult = await this.elasticService.search<ProductResponse>(
          {
            index: 'products',
            _source: {
              exclude: ['description'],
            },
            query: {
              function_score: {
                query: {
                  bool: {
                    must: [{ match_all: {} }],
                    must_not: must_not,
                  },
                },
                functions: [
                  {
                    script_score: {
                      script: {
                        lang: 'painless',
                        source: `   
                      double totalScore = 0.0;
                      if (params['ownerIds'].contains(doc['ownerId'].value)) {
                        totalScore = totalScore + 1
                      }
                      long millis = doc['created_at'].value.millis;
                      double dateScore = Math.log(millis);
                      totalScore = totalScore + dateScore;
                      return totalScore;
                      `,
                        params: {
                          ownerIds: followerIds,
                        },
                      },
                    },
                  },
                ],
              },
            },
            from: offset,
            size: limit,
          },
        );
        total = elasticCount.count;
        rs = elasticResult.hits.hits.map((productSource) => {
          return productSource._source;
        });
        await this.cacheManager.set(keyCache, {
          total,
          data: rs,
        });
      }

      const { hasNextPage, hasPrevPage, pages } = paginationFn({
        limit,
        page,
        total,
      });
      return {
        limit,
        page,
        total,
        pages,
        hasNextPage,
        hasPrevPage,
        data: rs,
        cache: isCache,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.body);
      console.log(JSON.stringify(error.body));
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }
}
