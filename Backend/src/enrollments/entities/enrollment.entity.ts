import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EnrollmentStatus } from '../../common/enums';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column({ nullable: true })
  subjectId?: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  progress: number;

  @Column({
    type: 'varchar2',
    length: 20,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @ManyToOne(
    () => User,
    user => user.enrollments,
  )
  user: User;

  @ManyToOne(
    () => Course,
    course => course.enrollments,
  )
  course: Course;

  @ManyToOne(
    () => Subject,
    {
      nullable: true,
    },
  )
  subject?: Subject;

  @CreateDateColumn()
  enrolledAt: Date;
}