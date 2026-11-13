
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const existingSubject = await this.subjectsRepository.findOne({
      where: { code: createSubjectDto.code },
    });

    if (existingSubject) {
      throw new ConflictException(
        `A subject with code "${createSubjectDto.code}" already exists`,
      );
    }

    const subject = this.subjectsRepository.create({
      ...createSubjectDto,
      status: createSubjectDto.status ?? 'active',
    });

    return this.subjectsRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find({
      relations: {
        teachers: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: {
        teachers: true,
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);

    if (
      updateSubjectDto.code &&
      updateSubjectDto.code !== subject.code
    ) {
      const existingSubject = await this.subjectsRepository.findOne({
        where: { code: updateSubjectDto.code },
      });

      if (existingSubject && existingSubject.id !== id) {
        throw new ConflictException(
          `A subject with code "${updateSubjectDto.code}" already exists`,
        );
      }
    }

    Object.assign(subject, updateSubjectDto);

    return this.subjectsRepository.save(subject);
  }

  async remove(id: number): Promise<{ message: string }> {
    const subject = await this.findOne(id);

    await this.subjectsRepository.remove(subject);

    return {
      message: `Subject "${subject.name}" deleted successfully`,
    };
  }

  async assignTeacher(
    subjectId: number,
    teacherId: number,
  ): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id: subjectId },
      relations: {
        teachers: true,
      },
    });

    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${subjectId} not found`,
      );
    }

    const teacher = await this.teachersRepository.findOne({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${teacherId} not found`,
      );
    }

    if (teacher.status !== 'active') {
      throw new ConflictException(
        `Teacher "${teacher.fullName}" is inactive and cannot be assigned`,
      );
    }

    if (subject.status !== 'active') {
      throw new ConflictException(
        `Subject "${subject.name}" is inactive and cannot receive assignments`,
      );
    }

    if (teacher.level !== subject.level) {
      throw new ConflictException(
        `Teacher level "${teacher.level}" does not match subject level "${subject.level}"`,
      );
    }

    const alreadyAssigned = subject.teachers.some(
      (existingTeacher) => existingTeacher.id === teacherId,
    );

    if (alreadyAssigned) {
      throw new ConflictException(
        `Teacher "${teacher.fullName}" is already assigned to subject "${subject.name}"`,
      );
    }

    subject.teachers.push(teacher);

    return this.subjectsRepository.save(subject);
  }

  async removeTeacher(
    subjectId: number,
    teacherId: number,
  ): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id: subjectId },
      relations: {
        teachers: true,
      },
    });

    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${subjectId} not found`,
      );
    }

    const teacherExists = subject.teachers.some(
      (teacher) => teacher.id === teacherId,
    );

    if (!teacherExists) {
      throw new NotFoundException(
        `Teacher with ID ${teacherId} is not assigned to subject "${subject.name}"`,
      );
    }

    subject.teachers = subject.teachers.filter(
      (teacher) => teacher.id !== teacherId,
    );

    return this.subjectsRepository.save(subject);
  }
}
