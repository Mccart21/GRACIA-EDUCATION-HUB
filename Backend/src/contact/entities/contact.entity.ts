import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContactStatus } from '../../common/enums';

@Entity('contact_messages')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  email: string;

  @Column({ nullable: true, length: 30 })
  phone?: string;

  @Column({ length: 200 })
  subject: string;

  @Column({ type: 'clob' })
  message: string;

  @Column({
    type: 'varchar2',
    length: 20,
    default: ContactStatus.NEW,
  })
  status: ContactStatus;

  @CreateDateColumn()
  createdAt: Date;
}