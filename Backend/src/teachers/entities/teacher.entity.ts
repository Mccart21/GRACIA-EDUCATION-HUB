import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from '../../courses/entities/course.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ nullable: true, length: 30 })
  phone?: string;

  @Column({ nullable: true, length: 150 })
  specialization?: string;

  @Column({ nullable: true, length: 200 })
  qualification?: string;

  @Column({ type: 'clob', nullable: true })
  bio?: string;

  @Column({ nullable: true, length: 500 })
  image?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Course, course => course.teacher)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}