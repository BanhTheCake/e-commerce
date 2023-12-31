import { Controller, Get } from '@nestjs/common';
import dienThoaiVaPhuKien from '@/mocks/data/Dien-Thoai-and-Phu-Kien.json';
import mayAnhVaMayQuay from '@/mocks/data/May-Anh-and-May-Quay-Phim.json';
import mayTinhVaLaptop from '@/mocks/data/May-Tinh-and-Laptop.json';
import meVaBe from '@/mocks/data/Me-and-Be.json';
import nhaCuaVaDoiSong from '@/mocks/data/Nha-Cua-and-Doi-Song.json';
import sacDep from '@/mocks/data/Sac-Dep.json';
import sucKhoe from '@/mocks/data/Suc-Khoe.json';
import thietBiDiepTu from '@/mocks/data/Thiet-Bi-Dien-Tu.json';
import thoiTrangNam from '@/mocks/data/Thoi-Trang-Nam.json';
import thoiTrangNu from '@/mocks/data/Thoi-Trang-Nu.json';
import { slugifyFn } from './utils/slugify';
import { CategoriesService } from '@/categories/categories.service';
import { omit, pick } from 'lodash';
import { ImageType } from './entities/enum';
import { ProductsService } from './products/products.service';
import { ImagesService } from './images/images.service';
import { ElasticSearchService } from '@app/shared/elastic_search/elasticSearch.service';

interface IMockData {
  images: { img: string }[];
  attr: {
    label: string;
    star: string;
    price: string;
    quantity: string;
    description: string;
  };
  category: string;
  id: number;
}
const mockOwnerId = 'e7eb00d2-5575-4c2f-b309-ff08153ae958';
const mockCategories = [
  {
    label: dienThoaiVaPhuKien[0].category,
    items: dienThoaiVaPhuKien,
    image:
      'https://down-vn.img.susercontent.com/file/31234a27876fb89cd522d7e3db1ba5ca_tn',
  },
  {
    label: mayAnhVaMayQuay[0].category,
    items: mayAnhVaMayQuay,
    image:
      'https://down-vn.img.susercontent.com/file/ec14dd4fc238e676e43be2a911414d4d_tn',
  },
  {
    label: mayTinhVaLaptop[0].category,
    items: mayTinhVaLaptop,
    image:
      'https://down-vn.img.susercontent.com/file/c3f3edfaa9f6dafc4825b77d8449999d_tn',
  },
  {
    label: meVaBe[0].category,
    items: meVaBe,
    image:
      'https://down-vn.img.susercontent.com/file/099edde1ab31df35bc255912bab54a5e_tn',
  },
  {
    label: nhaCuaVaDoiSong[0].category,
    items: nhaCuaVaDoiSong,
    image:
      'https://down-vn.img.susercontent.com/file/24b194a695ea59d384768b7b471d563f_tn',
  },
  {
    label: sucKhoe[0].category,
    items: sucKhoe,
    image:
      'https://down-vn.img.susercontent.com/file/49119e891a44fa135f5f6f5fd4cfc747_tn',
  },
  {
    label: thietBiDiepTu[0].category,
    items: thietBiDiepTu,
    image:
      'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5_tn',
  },
  {
    label: thoiTrangNam[0].category,
    items: thoiTrangNam,
    image:
      'https://down-vn.img.susercontent.com/file/687f3967b7c2fe6a134a2c11894eea4b_tn',
  },
  {
    label: thoiTrangNu[0].category,
    items: thoiTrangNu,
    image:
      'https://down-vn.img.susercontent.com/file/75ea42f9eca124e9cb3cde744c060e4d_tn',
  },
  {
    label: sacDep[0].category,
    items: sacDep,
    image:
      'https://down-vn.img.susercontent.com/file/ef1f336ecc6f97b790d5aae9916dcb72_tn',
  },
];

@Controller('')
export class AppController {
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private imagesService: ImagesService,
    private elasticService: ElasticSearchService,
  ) {}

  formatCurrency(value: string) {
    const currencyArr = value.split('-').map((currency) => currency.trim());
    if (currencyArr.length > 1) {
      return parseInt(currencyArr.at(-1).replace('₫', '').replace('.', ''));
    }
    return parseInt(currencyArr[0].replace('₫', '').replace('.', ''));
  }

  handleProduct(productInput: IMockData['attr']) {
    const star = Number(productInput.star);
    const price = this.formatCurrency(productInput.price);
    const quantity = parseInt(productInput.quantity);
    const product = {
      ...productInput,
      star,
      price,
      quantity,
      slug: slugifyFn(
        productInput.label.replace(/\[[^\]]*\]|[!@#$%^&*|()+]/g, '').trim(),
      ).replace('and', 'va'),
      ownerId: mockOwnerId,
    };
    return product;
  }

  handleImages(imagesInput: IMockData['images'], productId: string) {
    const images = imagesInput.map((image) => ({
      url: image.img,
      productId,
      role: ImageType.PRODUCT,
    }));
    return images;
  }

  @Get('mock/categories')
  mockCategories() {
    const categories = mockCategories.map((category) => ({
      ...pick(category, ['label']),
      slug: slugifyFn(category.label).replace('and', 'va'),
    }));
    return this.categoriesService.helpers.bulkInsert(categories);
  }

  @Get('mock/images_category')
  mockImagesCategory() {
    const arrPromises = mockCategories.map(async (mock) => {
      const category = mock.label;
      const categorySlug = slugifyFn(category).replace('and', 'va');
      const categoryEntity = await this.categoriesService.helpers
        .createQueryBuilder('category')
        .where('category.slug = :slug', { slug: categorySlug })
        .getOne();
      const [image] = this.imagesService.helpers.create({
        key: 'category',
        data: [
          {
            url: mock.image,
            categoryId: categoryEntity.id,
          },
        ],
      });
      await this.imagesService.helpers.bulkInsert([image]);
    });
    return Promise.all(arrPromises);
  }

  @Get('mock/products')
  async mockProducts() {
    const arrPromises = mockCategories.map(async (mock) => {
      const category = mock.label;
      const categorySlug = slugifyFn(category).replace('and', 'va');
      const categoryEntity = await this.categoriesService.helpers
        .createQueryBuilder('category')
        .where('category.slug = :slug', { slug: categorySlug })
        .getOne();
      const productEntities = [];
      for (const item of mock.items) {
        const product = this.handleProduct(item.attr);
        const [productEntity] =
          await this.productsService.helpers.bulkInsert.product([product]);
        const images = this.handleImages(item.images, productEntity.id);
        await this.imagesService.helpers.bulkInsert(images);
        productEntities.push(productEntity);
      }
      const productsCategories = productEntities.map((product) => {
        return {
          productId: product.id,
          categoryId: categoryEntity.id,
        };
      });
      await this.productsService.helpers.bulkInsert.productCategory(
        productsCategories,
      );
    });
    await Promise.all(arrPromises);
    return 'Done';
  }

  @Get('mock/elastic')
  async mockElastic() {
    const products = await this.productsService.helpers.mock.getAll();
    const operations = products.flatMap((doc) => [
      { index: { _index: 'products', _id: doc.id } },
      doc,
    ]);
    return this.elasticService.bulk(operations, 'products');
  }
}
