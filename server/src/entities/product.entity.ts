import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { Images } from './image.entity';
import { Products_Categories } from './products-categories.entity';

@Entity({
  name: 'products',
})
export class Products extends DatabaseEntity {
  @Column()
  label: string;

  @Column()
  slug: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'float', default: 0 })
  star: number;

  @Column({ type: 'text' })
  description: string;

  //  User delete -> effect to product depend on onDelete
  @ManyToOne(() => Users, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  user: Users;

  @OneToMany(() => Images, (image) => image.product, {
    cascade: true,
  })
  images: Images[];

  @OneToMany(
    () => Products_Categories,
    (productCategory) => productCategory.product,
    { cascade: true },
  )
  productCategory: Products_Categories[];
}