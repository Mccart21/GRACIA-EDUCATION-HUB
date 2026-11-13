import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  planId!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => SubscriptionPlan, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan!: SubscriptionPlan;

  @Column({
    length: 30,
    default: 'pending',
  })
  status!: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startsAt!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiresAt!: Date | null;

  @Column({
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  paymentReference!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}