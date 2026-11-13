
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'number',
  })
  id!: number;

  @Column({
    name: 'userId',
    type: 'number',
  })
  userId!: number;

  @Column({
    name: 'subscriptionId',
    type: 'number',
  })
  subscriptionId!: number;

  @Column({
    name: 'planId',
    type: 'number',
  })
  planId!: number;

  @Column({
    name: 'courseId',
    type: 'number',
    nullable: true,
  })
  courseId!: number | null;

  @Column({
    name: 'subjectId',
    type: 'number',
    nullable: true,
  })
  subjectId!: number | null;

  @Column({
    name: 'amount',
    type: 'number',
  })
  amount!: number;

  @Column({
    name: 'currency',
    type: 'varchar2',
    length: 10,
    default: 'MWK',
  })
  currency!: string;

  @Column({
    name: 'paymentMethod',
    type: 'varchar2',
    length: 50,
  })
  paymentMethod!: string;

  @Column({
    name: 'provider',
    type: 'varchar2',
    length: 50,
  })
  provider!: string;

  @Column({
    name: 'transactionReference',
    type: 'varchar2',
    length: 150,
    nullable: true,
  })
  transactionReference!: string | null;

  @Column({
    name: 'status',
    type: 'varchar2',
    length: 30,
    default: 'pending',
  })
  status!: string;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
  })
  updatedAt!: Date;
}
