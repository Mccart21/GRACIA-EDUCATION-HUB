
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'PENDING_REGISTRATIONS' })
@Index('UQ_PENDING_REG_EMAIL', ['email'], { unique: true })
@Index('UQ_PENDING_REG_USERNAME', ['username'], { unique: true })
export class PendingRegistration {
  @PrimaryGeneratedColumn({
    name: 'ID',
    type: 'number',
  })
  id!: number;

  @Column({ name: 'USERNAME', type: 'varchar2', length: 100 })
  username!: string;

  @Column({ name: 'EMAIL', type: 'varchar2', length: 255 })
  email!: string;

  @Column({ name: 'STUDENT_LEVEL', type: 'varchar2', length: 30 })
  level!: string;

  @Column({ name: 'PASSWORD', type: 'varchar2', length: 255 })
  password!: string;

  @Column({
    name: 'VERIFICATIONCODEHASH',
    type: 'varchar2',
    length: 64,
  })
  verificationCodeHash!: string;

  @Column({
    name: 'VERIFICATIONEXPIRESAT',
    type: 'timestamp',
  })
  verificationExpiresAt!: Date;

  @CreateDateColumn({
    name: 'CREATEDAT',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
