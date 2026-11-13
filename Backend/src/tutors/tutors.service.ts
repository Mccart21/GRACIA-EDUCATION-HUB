import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './entities/tutor.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private readonly tutorsRepository: Repository<Tutor>,

    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create(createTutorDto: CreateTutorDto): Promise<Tutor> {
    const existingTutor = await this.tutorsRepository.findOne({
      where: { email: createTutorDto.email },
    });

    if (existingTutor) {
      throw new ConflictException(
        `A tutor with email "${createTutorDto.email}" already exists`,
      );
    }

    const tutor = this.tutorsRepository.create({
      ...createTutorDto,
      status: createTutorDto.status ?? 'active',
    });

    return this.tutorsRepository.save(tutor);
  }

  async findAll(): Promise<Tutor[]> {
    return this.tutorsRepository.find({
      relations: {
        courses: true,
      },
      order: {
        fullName: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Tutor> {
    const tutor = await this.tutorsRepository.findOne({
      where: { id },
      relations: {
        courses: true,
      },
    });

    if (!tutor) {
      throw new NotFoundException(
        `Tutor with ID ${id} not found`,
      );
    }

    return tutor;
  }

  async update(
    id: number,
    updateTutorDto: UpdateTutorDto,
  ): Promise<Tutor> {
    const tutor = await this.findOne(id);

    if (
      updateTutorDto.email &&
      updateTutorDto.email !== tutor.email
    ) {
      const existingTutor = await this.tutorsRepository.findOne({
        where: { email: updateTutorDto.email },
      });

      if (existingTutor && existingTutor.id !== id) {
        throw new ConflictException(
          `A tutor with email "${updateTutorDto.email}" already exists`,
        );
      }
    }

    Object.assign(tutor, updateTutorDto);

    return this.tutorsRepository.save(tutor);
  }

  async remove(id: number): Promise<{ message: string }> {
    const tutor = await this.findOne(id);

    await this.tutorsRepository.remove(tutor);

    return {
      message: `Tutor "${tutor.fullName}" deleted successfully`,
    };
  }

  async assignCourse(
    tutorId: number,
    courseId: number,
  ): Promise<Tutor> {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
      relations: {
        courses: true,
      },
    });

    if (!tutor) {
      throw new NotFoundException(
        `Tutor with ID ${tutorId} not found`,
      );
    }

    if (tutor.status.toLowerCase() !== 'active') {
      throw new BadRequestException(
        `Tutor "${tutor.fullName}" is inactive and cannot be assigned courses`,
      );
    }

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found`,
      );
    }

    const courseLevel = course.level.trim().toLowerCase();

    if (
      courseLevel !== 'tertiary' &&
      courseLevel !== 'practical skills'
    ) {
      throw new BadRequestException(
        `Course "${course.title}" belongs to the ${course.level} level. Only Tertiary and Practical Skills courses can be assigned to tutors.`,
      );
    }

    const tutorLevel = tutor.level.trim().toLowerCase();

    const expectedCourseLevel =
      tutorLevel === 'skills'
        ? 'practical skills'
        : tutorLevel;

    if (
      expectedCourseLevel !== 'tertiary' &&
      expectedCourseLevel !== 'practical skills'
    ) {
      throw new BadRequestException(
        `Tutor level "${tutor.level}" is not valid for course assignment`,
      );
    }

    if (courseLevel !== expectedCourseLevel) {
      throw new BadRequestException(
        `Tutor "${tutor.fullName}" has level "${tutor.level}" and cannot be assigned the "${course.level}" course "${course.title}"`,
      );
    }

    const alreadyAssigned = (tutor.courses ?? []).some(
      (existingCourse) => existingCourse.id === courseId,
    );

    if (alreadyAssigned) {
      throw new ConflictException(
        `Course "${course.title}" is already assigned to tutor "${tutor.fullName}"`,
      );
    }

    tutor.courses.push(course);

    return this.tutorsRepository.save(tutor);
  }

  async removeCourse(
    tutorId: number,
    courseId: number,
  ): Promise<Tutor> {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
      relations: {
        courses: true,
      },
    });

    if (!tutor) {
      throw new NotFoundException(
        `Tutor with ID ${tutorId} not found`,
      );
    }

    const courseExists = (tutor.courses ?? []).some(
      (course) => course.id === courseId,
    );

    if (!courseExists) {
      throw new NotFoundException(
        `Course with ID ${courseId} is not assigned to tutor "${tutor.fullName}"`,
      );
    }

    tutor.courses = tutor.courses.filter(
      (course) => course.id !== courseId,
    );

    return this.tutorsRepository.save(tutor);
  }
}