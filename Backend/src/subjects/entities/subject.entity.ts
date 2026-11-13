
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ type: 'clob', nullable: true })
  description!: string;

  @Column({ length: 20 })
  level!: string;

  @Column({ length: 20, default: 'active' })
  status!: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  @JoinTable({
    name: 'teacher_subjects',
    joinColumn: {
      name: 'subjectId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'teacherId',
      referencedColumnName: 'id',
    },
  })
  teachers!: Teacher[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
