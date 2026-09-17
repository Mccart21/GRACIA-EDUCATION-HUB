import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  EducationLevel,
  UserRole,
} from '../../common/enums';

import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 30 })
  phone?: string;

  @Column({
    type: 'varchar2',
    length: 30,
    nullable: true,
  })
  level?: EducationLevel;

  @Column({
    type: 'varchar2',
    length: 30,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, enrollment => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];

  @OneToMany(() => Feedback, feedback => feedback.user)
  feedback: Feedback[];
}