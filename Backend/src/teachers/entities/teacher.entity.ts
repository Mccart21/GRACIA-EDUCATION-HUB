
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Subject } from '../../subjects/entities/subject.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  fullName!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 30, nullable: true })
  phone!: string;

  @Column({ type: 'clob', nullable: true })
  bio!: string;

  @Column({ length: 20 })
  level!: string;

  @Column({ length: 20, default: 'active' })
  status!: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  subjects!: Subject[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
