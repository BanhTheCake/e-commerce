import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';

@Entity({
  name: 'tokens',
})
export class Tokens extends DatabaseEntity {
  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expiredIn: Date;

  @ManyToOne(() => Users, (user) => user.forgotTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;
}
