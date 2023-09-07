import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { UserRoles, UserType } from './enum';
import { DatabaseEntity } from '@app/shared';
import { Products } from './product.entity';
import { Tokens } from './token.entity';
import { Images } from './image.entity';

@Entity({
  name: 'users',
})
export class Users extends DatabaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.LOCAL,
  })
  type: UserType;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  rfToken: string;

  @Column({ nullable: true })
  activeToken: string;

  // When user created -> effect to product
  @OneToMany(() => Products, (product) => product.user, {
    cascade: true,
  })
  products: Products[];

  @OneToMany(() => Tokens, (token) => token.user, {
    cascade: true,
  })
  forgotTokens: Tokens[];

  @OneToOne(() => Images, (image) => image.user, {
    cascade: true,
  })
  image: Images;
}