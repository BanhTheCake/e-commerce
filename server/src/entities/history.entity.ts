import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';
import { ProductHistories } from './productHistory.entity';

@Entity({
  name: 'histories',
})
export class Histories extends DatabaseEntity {
  @Index('pk_history_users')
  @Column()
  userId: string;

  @Column({ type: 'integer', default: 0 })
  total: number;

  @ManyToOne(() => Users, (user) => user.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(
    () => ProductHistories,
    (productHistory) => productHistory.history,
    {
      cascade: true,
    },
  )
  productHistories: ProductHistories[];
}
