import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateSubjectDto) {
    const subject = this.subjectsRepository.create(dto);

    return this.subjectsRepository.save(subject);
  }

  async findAll() {
    return this.subjectsRepository.find({
      relations: {
        course: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: {
        course: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    const subject = await this.findOne(id);

    Object.assign(subject, dto);

    return this.subjectsRepository.save(subject);
  }

  async remove(id: number) {
    const subject = await this.findOne(id);

    await this.subjectsRepository.remove(subject);

    return {
      message: 'Subject deleted successfully',
    };
  }
}