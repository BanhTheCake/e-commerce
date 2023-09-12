import { Categories } from '@/entities/category.entity';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CreateNewCategoryDto } from './dto/create-new-category.dto';
import { slugifyFn } from '@/utils/slugify';
import { GetAllCategoriesDto } from './dto/get-all-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CREATE_CATEGORY_ROUTE,
  DELETE_CATEGORY_ROUTE,
  GET_ALL_CATEGORY_ROUTE,
  UPDATE_CATEGORY_ROUTE,
} from '@/constant/category.constant';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private elasticServices: ElasticSearchService,
  ) {}

  async validateCategories(categoriesId: string[]) {
    const categories = await Promise.all(
      categoriesId.map(async (id) => {
        const category = await this.categoriesRepository.findOne({
          where: { id },
        });
        if (!category)
          throw new BadRequestException(`Category with id ${id} not found`);
        return category;
      }),
    );
    return categories;
  }

  findWith(where: FindOneOptions<Categories>['where']) {
    return this.categoriesRepository.findOne({ where });
  }

  async bulkInsert(categoryList: { label: string; slug: string }[]) {
    const categoryEntities = this.categoriesRepository.create(categoryList);
    await this.categoriesRepository.save(categoryEntities);
    return categoryEntities;
  }

  async createNew(data: CreateNewCategoryDto) {
    try {
      const { label } = data;
      const slug = slugifyFn(label);

      const currentCategory = await this.categoriesRepository.findOne({
        where: [{ label }, { slug }],
      });
      if (currentCategory) {
        throw new BadRequestException(CREATE_CATEGORY_ROUTE.ALREADY_EXIST);
      }
      const newCategory = this.categoriesRepository.create({
        ...data,
        slug,
      });
      await this.categoriesRepository.save(newCategory);
      return {
        errCode: 0,
        message: CREATE_CATEGORY_ROUTE.SUCCESS,
        data: newCategory,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async getAll(data: GetAllCategoriesDto) {
    try {
      const { q = '' } = data;
      const categories = await this.categoriesRepository.find({
        where: [{ label: Like(`%${q}%`) }, { slug: Like(`%${slugifyFn(q)}%`) }],
      });
      return {
        errCode: 0,
        message: GET_ALL_CATEGORY_ROUTE.SUCCESS,
        data: categories,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async updateOne(id: string, data: UpdateCategoryDto) {
    try {
      let currentCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!currentCategory) {
        throw new BadRequestException(UPDATE_CATEGORY_ROUTE.NOT_FOUND);
      }
      const slug = slugifyFn(data.label);
      currentCategory = {
        ...currentCategory,
        ...data,
        slug,
      };
      await this.categoriesRepository.save(currentCategory);
      return {
        errCode: 0,
        message: UPDATE_CATEGORY_ROUTE.SUCCESS,
        data: currentCategory,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Something wrong with server!');
    }
  }

  async deleteOne(id: string) {
    try {
      const currentCategory = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!currentCategory) {
        throw new BadRequestException(DELETE_CATEGORY_ROUTE.NOT_FOUND);
      }
      await this.categoriesRepository.softRemove(currentCategory);

      // update all products has this category
      await this.elasticServices.updateByQuery({
        index: 'products',
        query: {
          nested: {
            path: 'categories',
            query: {
              match: {
                'categories.id': currentCategory.id,
              },
            },
          },
        },
        script: {
          lang: 'painless',
          source: `
          if (ctx._source.categories != null) {
            for (int i=ctx._source.categories.length-1; i>=0; i--) {
                if (ctx._source.categories[i].id == params.value_to_remove) {
                    ctx._source.categories.remove(i);
                }
            }
          }
          `,
          params: {
            value_to_remove: currentCategory.id,
          },
        },
      });
      return {
        errCode: 0,
        message: DELETE_CATEGORY_ROUTE.SUCCESS,
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
