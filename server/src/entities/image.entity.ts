import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Unique,
  Index,
} from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { ImageType } from './enum';
import { Products } from './product.entity';
import { Categories } from './category.entity';

@Entity({
  name: 'images',
})
@Unique('ProductId@Url', ['productId', 'url'])
export class Images extends DatabaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  publicKey: string;

  @Index('pk_images_users')
  @Column({ nullable: true })
  ownerId: string;

  @Index('pk_images_products')
  @Column({ nullable: true })
  productId: string;

  @Index('pk_images_categories')
  @Column({ nullable: true })
  categoryId: string;

  @OneToOne(() => Users, (user) => user.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  user: Users;

  @OneToOne(() => Categories, (category) => category.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Categories;

  @ManyToOne(() => Products, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;
}
