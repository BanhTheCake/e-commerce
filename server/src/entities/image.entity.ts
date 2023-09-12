import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { ImageType } from './enum';
import { Products } from './product.entity';

@Entity({
  name: 'images',
})
export class Images extends DatabaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  publicKey: string;

  @Column({
    type: 'enum',
    enum: ImageType,
    default: ImageType.USER,
  })
  role: ImageType;

  @Column({ nullable: true })
  ownerId: string;

  @Column({ nullable: true })
  productId: string;

  @OneToOne(() => Users, (user) => user.image, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  user: Users;

  @ManyToOne(() => Products, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;
}
