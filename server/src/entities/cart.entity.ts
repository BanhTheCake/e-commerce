import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { CartItems } from './cartItem.entity';

@Entity({
  name: 'carts',
})
export class Carts extends DatabaseEntity {
  @Index('pk_carts')
  @Column()
  userId: string;

  @Column({ type: 'integer', default: 0 })
  total: number;

  @OneToOne(() => Users, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(() => CartItems, (cartItem) => cartItem.cart)
  cartItems: CartItems[];
}
