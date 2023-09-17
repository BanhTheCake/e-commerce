import { Entity, Column, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Products } from './product.entity';
import { Carts } from './cart.entity';

@Entity({
  name: 'cartItems',
})
export class CartItems extends DatabaseEntity {
  @Column()
  cartId: string;

  @Column()
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @ManyToOne(() => Carts, (card) => card.cartItems, {
    onDelete: 'CASCADE',
  })
  cart: Carts;

  @ManyToOne(() => Products, (product) => product.cart, {
    onDelete: 'CASCADE',
  })
  product: Products;
}
