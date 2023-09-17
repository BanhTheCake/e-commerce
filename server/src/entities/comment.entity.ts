import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { Products } from './product.entity';

@Entity({
  name: 'comments',
})
export class Comments extends DatabaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'integer', nullable: true })
  starValue?: number;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column({ nullable: true })
  replyId?: string;

  @ManyToOne(() => Users, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Products, (product) => product.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;

  @ManyToOne(() => Comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'replyId' })
  replyTo?: Comments;

  @OneToMany(() => Comments, (comment) => comment.replyTo, {
    cascade: true,
  })
  reply?: Comments[];
}
