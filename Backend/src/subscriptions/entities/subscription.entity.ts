import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SubscriptionPlan } from '../../common/enums';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'varchar2',
    length: 20,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  price: number;

  @Column({
    length: 10,
    default: 'MWK',
  })
  currency: string;

  @Column()
  durationDays: number;

  @Column({ type: 'clob', nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => Payment,
    payment => payment.subscription,
  )
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}