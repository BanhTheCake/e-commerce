import { CategoriesService } from '@/categories/categories.service';
import {
  CREATE_PRODUCT_ROUTE,
  DELETE_PRODUCT_ROUTE,
  GET_PRODUCT_ROUTE,
  SUGGEST_ROUTE,
  UPDATE_PRODUCT_ROUTE,
} from '@/constant/product.constant';
import {
  Images,
  ProductDetails,
  Products,
  Products_Categories,
  Users,
} from '@/entities';
import { ImagesService } from '@/images/images.service';
import { IPagination } from '@/response/pagination';
import { UsersService } from '@/users/users.service';
import { paginationFn } from '@/utils/pagination';
import { slugifyFn } from '@/utils/slugify';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';
import {
  QueryDslQueryContainer,
  Sort,
} from '@elastic/elasticsearch/lib/api/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { cloneDeep, isEqual, omit, pickBy } from 'lodash';
import { DataSource, In, Not, Repository } from 'typeorm';
import { CreateNewDto } from './dto/create-new.dto';
import { DeleteDto } from './dto/delete.dto';
import { GetAllQueryDto, ORDER } from './dto/get-all.dto';
import { GetOneParamDto } from './dto/get-one-param.dto';
import { GetRelativesDto } from './dto/get-relatives.dto';
import { ProductResponse } from './dto/product.response';
import { SuggestDto } from './dto/suggest.dto';
import { UpdateBodyDto, UpdateParamDto } from './dto/update.dto';
import { ImageType } from '@/entities/enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateNewQueue } from './queue/create-new.queue';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Products_Categories)
    private readonly productsCategoriesRepository: Repository<Products_Categories>,
    @InjectRepository(ProductDetails)
    private readonly productDetailsRepository: Repository<ProductDetails>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('products') private productQueue: Queue,
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
    mock: {
      getAll: async () => {
        const products = await this.productsRepository
          .createQueryBuilder('products')
          .leftJoinAndSelect('products.productCategory', 'productCategory')
          .leftJoinAndSelect('productCategory.category', 'categories')
          .leftJoinAndSelect('products.images', 'images')
          .getMany();
        return products.map((product) => this.serializeProduct(product));
      },
    },
  };

  async validateDetails(productDetailIds: string[]) {
    for (const productDetailId of productDetailIds) {
      const productDetail = await this.productDetailsRepository.findOne({
        where: { id: productDetailId },
      });
      if (!productDetail) {
        throw new BadRequestException(
          `Product detail with id ${productDetailId} not found!`,
        );
      }
    }
  }

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
      .leftJoinAndSelect('products.details', 'details')
      .where('products.id = :id', { id })
      .getOne();
    if (!product) {
      throw new BadRequestException('Product not found!');
    }
    return this.serializeProduct(product);
  }

  // ========== FOR ROUTE ==========

  async createNew(data: CreateNewDto, user: Users) {
    const { label, categories: categoriesId, details, images } = data;
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
      ...omit(data, ['images', 'categories', 'details']),
      slug,
      ownerId: user.id,
    });
    // Add transaction
    const queryRunner = await this.helpers.starTransaction();
    try {
      await queryRunner.manager.save(newProduct);

      // create product category
      const newProductsCategories = categories.map((category) => ({
        productId: newProduct.id,
        categoryId: category.id,
      }));
      const newProductsCategoriesEntities =
        this.productsCategoriesRepository.create(newProductsCategories);

      // create product details
      const newDetails = details.map((detail) => ({
        name: detail.name,
        value: detail.value,
        productId: newProduct.id,
      }));
      const newDetailsEntities =
        this.productDetailsRepository.create(newDetails);

      // create images
      const newImages = images.map((image) => ({
        url: image.url,
        publicKey: image.publicId,
        role: ImageType.PRODUCT,
        productId: newProduct.id,
      }));
      const newImageEntities = this.imagesService.helpers.create(newImages);

      await queryRunner.manager.save(newProductsCategoriesEntities);
      await queryRunner.manager.save(newDetailsEntities);
      await queryRunner.manager.save(newImageEntities);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    const result = await this.getOne(newProduct.id);
    await this.productQueue.add(
      'Add new product',
      new CreateNewQueue('products', result.id, result),
    );
    return {
      errCode: 0,
      message: CREATE_PRODUCT_ROUTE.SUCCESS,
      data: result,
    };
  }

  async findOne({ id }: GetOneParamDto) {
    const cache = await this.cacheManager.get<ProductResponse>(`product:${id}`);
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
  }

  // Soft delete
  async deleteOne({ id }: DeleteDto) {
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
  }

  async updateOne({ id }: UpdateParamDto, data: UpdateBodyDto) {
    let currentProduct = await this.getOne(id);
    const copyCurrentProduct = cloneDeep(currentProduct);
    if (!currentProduct) {
      throw new BadRequestException(UPDATE_PRODUCT_ROUTE.NOT_FOUND);
    }
    const slug = slugifyFn(data.label ?? currentProduct.label);
    currentProduct = {
      ...currentProduct,
      ...omit(data, ['categories', 'details', 'images']),
      slug,
    };
    const queryRunner = await this.helpers.starTransaction();
    try {
      await queryRunner.manager.getRepository(Products).save(currentProduct);
      if (data.categories) {
        // [VALIDATE]
        await this.categoriesService.helpers.validate(data.categories);

        // [DELETE]
        await queryRunner.manager.getRepository(Products_Categories).delete({
          categoryId: Not(In(data.categories)),
          productId: currentProduct.id,
        });

        // [INSERT_OR_UPDATE]
        const categoryEntities = [];
        data.categories.forEach((category) => {
          const categoryEntity = this.productsCategoriesRepository.create({
            categoryId: category,
            productId: currentProduct.id,
          });
          if (!categoryEntities.includes(categoryEntity)) {
            categoryEntities.push(categoryEntity);
          }
        });
        await queryRunner.manager
          .getRepository(Products_Categories)
          .upsert(categoryEntities, {
            skipUpdateIfNoValuesChanged: true,
            conflictPaths: ['productId', 'categoryId'], // create if not exist
          });
      }
      if (data.images) {
        // [MISSING]: VALIDATE IMAGES

        // [DELETE]
        const imagesId = data.images
          .map((image) => {
            return image.id;
          })
          .filter(Boolean);
        await queryRunner.manager.getRepository(Images).delete({
          id: Not(In(imagesId)),
          productId: currentProduct.id,
        });

        // [INSERT_OR_UPDATE]
        const imagesEntity = [];
        data.images.forEach((image) => {
          const [imageEntity] = this.imagesService.helpers.create([
            {
              ...image,
              productId: currentProduct.id,
              role: ImageType.PRODUCT,
            },
          ]);
          if (!imagesEntity.includes(imageEntity)) {
            imagesEntity.push(imageEntity);
          }
        });
        console.log(imagesEntity);
        await queryRunner.manager.getRepository(Images).upsert(imagesEntity, {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['id'], // create if not exist
        });
      }
      if (data.details) {
        // [MISSING VALIDATE]

        // [DELETE]
        const detailsId = data.details
          .map((detail) => detail?.id)
          .filter(Boolean);
        await queryRunner.manager.getRepository(ProductDetails).delete({
          productId: currentProduct.id,
          id: Not(In(detailsId)),
        });

        // [INSERT_OR_UPDATE]
        const detailsEntity = [];
        data.details.forEach((detail) => {
          const detailEntity = this.productDetailsRepository.create({
            ...detail,
            productId: currentProduct.id,
          });
          if (!detailsEntity.includes(detailEntity)) {
            detailsEntity.push(detailEntity);
          }
        });

        await queryRunner.manager
          .getRepository(ProductDetails)
          .upsert(detailsEntity, {
            skipUpdateIfNoValuesChanged: true,
            conflictPaths: ['id'], // create if not exist
          });
      }
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
    await this.cacheManager.del('product:' + id);

    return {
      errCode: 0,
      message: UPDATE_PRODUCT_ROUTE.SUCCESS,
      data: result,
    };
  }

  async findAll(query: GetAllQueryDto): Promise<IPagination<any>> {
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
  }

  async autoSuggest({ q, limit = 10 }: SuggestDto) {
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
  }

  async findAllElastic(query: GetAllQueryDto) {
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
      const elasticResult = await this.elasticService.search<ProductResponse>({
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
      });

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
  }

  async findAllRelative(data: GetRelativesDto) {
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
      const elasticResult = await this.elasticService.search<ProductResponse>({
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
      });
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
  }
}
