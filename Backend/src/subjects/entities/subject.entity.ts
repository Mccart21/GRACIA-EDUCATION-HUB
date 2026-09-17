import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EducationLevel } from '../../common/enums';
import { Course } from '../../courses/entities/course.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ type: 'clob', nullable: true })
  description?: string;

  @Column({
    type: 'varchar2',
    length: 30,
  })
  level: EducationLevel;

  @Column({ nullable: true, length: 500 })
  image?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  courseId: number;

  @ManyToOne(
    () => Course,
    course => course.subjects,
    {
      onDelete: 'CASCADE',
    },
  )
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}