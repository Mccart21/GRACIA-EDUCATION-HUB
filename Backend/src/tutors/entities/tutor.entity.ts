
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Course } from '../../courses/entities/course.entity';

@Entity('tutors')
export class Tutor {
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

  @ManyToMany(() => Course, (course) => course.tutors)
  @JoinTable({
    name: 'tutor_courses',
    joinColumn: {
      name: 'tutorId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'courseId',
      referencedColumnName: 'id',
    },
  })
  courses!: Course[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
