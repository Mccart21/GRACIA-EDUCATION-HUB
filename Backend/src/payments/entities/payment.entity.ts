import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  PaymentMethod,
  PaymentStatus,
} from '../../common/enums';

import { User } from '../../users/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  subscriptionId: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({
    length: 10,
    default: 'MWK',
  })
  currency: string;

  @Column({
    type: 'varchar2',
    length: 30,
  })
  method: PaymentMethod;

  @Column({ nullable: true, length: 30 })
  phone?: string;

  @Column({
    type: 'varchar2',
    length: 20,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    unique: true,
    nullable: true,
    length: 150,
  })
  reference?: string;

  @ManyToOne(
    () => User,
    user => user.payments,
  )
  user: User;

  @ManyToOne(
    () => Subscription,
    subscription => subscription.payments,
  )
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;
}