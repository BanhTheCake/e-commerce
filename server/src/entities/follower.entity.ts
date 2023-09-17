import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DatabaseEntity } from '@app/shared';
import { Users } from './user.entity';

@Entity({
  name: 'followers',
})
export class Followers extends DatabaseEntity {
  @Column()
  userId: string;

  @Column()
  followingId: string;

  @ManyToOne(() => Users, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  follower: Users;

  @ManyToOne(() => Users, (user) => user.followings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: Users;
}
