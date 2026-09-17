import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create(dto: CreateCourseDto) {
    const course = this.coursesRepository.create(dto);

    return this.coursesRepository.save(course);
  }

  async findAll() {
    return this.coursesRepository.find({
      relations: {
        subjects: true,
        teacher: true,
        tutor: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: {
        subjects: true,
        teacher: true,
        tutor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.findOne(id);

    Object.assign(course, dto);

    return this.coursesRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);

    await this.coursesRepository.remove(course);

    return {
      message: 'Course deleted successfully',
    };
  }
}