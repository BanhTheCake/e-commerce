import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Products } from './product.entity';
import { Carts } from './cart.entity';

@Entity({
  name: 'cartItems',
})
export class CartItems extends DatabaseEntity {
  @Index('pk_cartItems_cart')
  @Column()
  cartId: string;

  @Index('pk_cartItems_product')
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
