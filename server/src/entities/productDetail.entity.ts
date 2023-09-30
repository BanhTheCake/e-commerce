import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Products } from './product.entity';

@Entity({
  name: 'ProductDetails',
})
export class ProductDetails extends DatabaseEntity {
  @Column()
  name: string;

  @Column()
  value: string;

  @Column()
  productId: string;

  @ManyToOne(() => Products, (product) => product.details)
  @JoinColumn({ name: 'productId' })
  product: Products;
}
