import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'number' })
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar2', length: 150 })
  title!: string;

  @Column({ type: 'varchar2', length: 1000 })
  message!: string;

  @Column({ type: 'varchar2', length: 50 })
  type!: string;

  @Column({ type: 'varchar2', length: 30, default: 'unread' })
  status!: string;

  @Column({ type: 'varchar2', length: 255, nullable: true })
  actionUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}