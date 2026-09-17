import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  EducationLevel,
  ServiceCategory,
} from '../../common/enums';

import { Subject } from '../../subjects/entities/subject.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ unique: true, length: 220 })
  slug: string;

  @Column({ type: 'clob' })
  description: string;

  @Column({
    type: 'varchar2',
    length: 30,
  })
  level: EducationLevel;

  @Column({
    type: 'varchar2',
    length: 50,
  })
  category: ServiceCategory;

  @Column({ nullable: true, length: 100 })
  duration?: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ nullable: true, length: 500 })
  image?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  teacherId?: number;

  @Column({ nullable: true })
  tutorId?: number;

  @ManyToOne(() => Teacher, {
    nullable: true,
  })
  teacher?: Teacher;

  @ManyToOne(() => Tutor, {
    nullable: true,
  })
  tutor?: Tutor;

  @OneToMany(() => Subject, subject => subject.course)
  subjects: Subject[];

  @OneToMany(() => Enrollment, enrollment => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}