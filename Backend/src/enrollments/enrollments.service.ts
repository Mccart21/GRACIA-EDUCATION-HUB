
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async enroll(userId: number, courseId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.enrollmentRepository.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (existing) {
      return existing;
    }

    const enrollment = this.enrollmentRepository.create({
      userId,
      courseId,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async getUserEnrollments(userId: number) {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: {
        course: true,
      },
      order: {
        enrolledAt: 'DESC',
      },
    });
  }

  async getEnrollment(userId: number, courseId: number) {
    return this.enrollmentRepository.findOne({
      where: {
        userId,
        courseId,
      },
      relations: {
        course: true,
      },
    });
  }
}
