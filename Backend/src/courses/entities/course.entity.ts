
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tutor } from '../../tutors/entities/tutor.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: 'clob' })
  description!: string;

  @Column({ length: 50 })
  level!: string;

  @Column({ length: 100 })
  category!: string;

  @Column({ length: 50 })
  duration!: string;

  @Column()
  lessons!: number;

  @Column({ length: 100, nullable: true })
  icon!: string;

  @Column({ type: 'clob', nullable: true })
  keywords!: string;

  @ManyToMany(() => Tutor, (tutor) => tutor.courses)
  tutors!: Tutor[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
