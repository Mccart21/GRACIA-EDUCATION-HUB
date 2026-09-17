import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FeedbackType } from '../../common/enums';

import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  courseId?: number;

  @Column({ nullable: true })
  subjectId?: number;

  @Column({ nullable: true })
  rating?: number;

  @Column({ type: 'clob' })
  message: string;

  @Column({
    type: 'varchar2',
    length: 30,
    default: FeedbackType.GENERAL,
  })
  type: FeedbackType;

  @ManyToOne(
    () => User,
    user => user.feedback,
    {
      nullable: true,
    },
  )
  user?: User;

  @ManyToOne(
    () => Course,
    {
      nullable: true,
    },
  )
  course?: Course;

  @ManyToOne(
    () => Subject,
    {
      nullable: true,
    },
  )
  subject?: Subject;

  @CreateDateColumn()
  createdAt: Date;
}