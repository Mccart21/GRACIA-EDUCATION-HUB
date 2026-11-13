
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const existingTeacher = await this.teachersRepository.findOne({
      where: { email: createTeacherDto.email },
    });

    if (existingTeacher) {
      throw new ConflictException(
        `A teacher with email "${createTeacherDto.email}" already exists`,
      );
    }

    const teacher = this.teachersRepository.create({
      ...createTeacherDto,
      status: createTeacherDto.status ?? 'active',
    });

    return this.teachersRepository.save(teacher);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teachersRepository.find({
      relations: {
        subjects: true,
      },
      order: {
        fullName: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: {
        subjects: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.findOne(id);

    if (
      updateTeacherDto.email &&
      updateTeacherDto.email !== teacher.email
    ) {
      const existingTeacher = await this.teachersRepository.findOne({
        where: { email: updateTeacherDto.email },
      });

      if (existingTeacher && existingTeacher.id !== id) {
        throw new ConflictException(
          `A teacher with email "${updateTeacherDto.email}" already exists`,
        );
      }
    }

    Object.assign(teacher, updateTeacherDto);

    return this.teachersRepository.save(teacher);
  }

  async remove(id: number): Promise<{ message: string }> {
    const teacher = await this.findOne(id);

    await this.teachersRepository.remove(teacher);

    return {
      message: `Teacher "${teacher.fullName}" deleted successfully`,
    };
  }
}
