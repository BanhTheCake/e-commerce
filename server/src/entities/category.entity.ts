import { Entity, Column, OneToMany } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Products_Categories } from './products-categories.entity';

@Entity({
  name: 'categories',
})
export class Categories extends DatabaseEntity {
  @Column({ unique: true })
  label: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(
    () => Products_Categories,
    (products_categories) => products_categories.category,
    { cascade: true },
  )
  productCategory: Products_Categories[];
}
