import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  code!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 50 })
  duration!: string;

  @Column({ length: 20 })
  billingPeriod!: string;

  @Column({ type: 'number' })
  price!: number;

  @Column({ type: 'clob' })
  description!: string;

  @Column({ type: 'number', default: 0 })
  popular!: number;

  @Column({ type: 'clob', nullable: true })
  features!: string | null;

  @Column({ type: 'number', default: 1 })
  isActive!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}