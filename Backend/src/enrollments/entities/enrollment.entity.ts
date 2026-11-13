
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'id', type: 'number' })
  id!: number;

  @Column({ name: 'userId', type: 'number' })
  userId!: number;

  @Column({ name: 'courseId', type: 'number' })
  courseId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId', referencedColumnName: 'id' })
  course!: Course;

  @CreateDateColumn({ name: 'enrolledAt', type: 'timestamp' })
  enrolledAt!: Date;
}
