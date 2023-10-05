import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Categories } from './category.entity';
import { Products } from './product.entity';

@Entity({
  name: 'products_categories',
})
@Unique('productCategory', ['productId', 'categoryId'])
export class Products_Categories extends DatabaseEntity {
  @Index('pk_productCategories_categories')
  @Column()
  categoryId: string;

  @Index('pk_productCategories_products')
  @Column()
  productId: string;

  @ManyToOne(() => Categories, (categories) => categories.productCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Categories;

  @ManyToOne(() => Products, (product) => product.productCategory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;
}
