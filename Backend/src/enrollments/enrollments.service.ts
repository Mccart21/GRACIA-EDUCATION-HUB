import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async create(dto: CreateEnrollmentDto) {
    const existing = await this.enrollmentsRepository.findOne({
      where: {
        userId: dto.userId,
        courseId: dto.courseId,
        ...(dto.subjectId !== undefined
          ? { subjectId: dto.subjectId }
          : {}),
      },
    });

    if (existing) {
      throw new BadRequestException(
        'The student is already enrolled',
      );
    }

    const enrollment =
      this.enrollmentsRepository.create(dto);

    return this.enrollmentsRepository.save(enrollment);
  }

  async findAll() {
    return this.enrollmentsRepository.find({
      relations: {
        user: true,
        course: true,
        subject: true,
      },
      order: {
        enrolledAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const enrollment =
      await this.enrollmentsRepository.findOne({
        where: { id },
        relations: {
          user: true,
          course: true,
          subject: true,
        },
      });

    if (!enrollment) {
      throw new NotFoundException(
        'Enrollment not found',
      );
    }

    return enrollment;
  }

  async update(
    id: number,
    dto: UpdateEnrollmentDto,
  ) {
    const enrollment = await this.findOne(id);

    Object.assign(enrollment, dto);

    return this.enrollmentsRepository.save(enrollment);
  }

  async remove(id: number) {
    const enrollment = await this.findOne(id);

    await this.enrollmentsRepository.remove(enrollment);

    return {
      message: 'Enrollment deleted successfully',
    };
  }
}