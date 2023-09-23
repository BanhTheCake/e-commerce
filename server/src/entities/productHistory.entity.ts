import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Products } from './product.entity';
import { Histories } from './history.entity';

@Entity({
  name: 'productHistories',
})
export class ProductHistories extends DatabaseEntity {
  @Column()
  historyId: string;

  @Column()
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer' })
  price: number;

  @ManyToOne(() => Products, (product) => product.productHistories, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => Histories, (history) => history.productHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'historyId' })
  history: Histories;
}
