import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tutor } from './entities/tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private readonly tutorsRepository: Repository<Tutor>,
  ) {}

  async create(dto: CreateTutorDto) {
    const tutor = this.tutorsRepository.create(dto);

    return this.tutorsRepository.save(tutor);
  }

  async findAll() {
    return this.tutorsRepository.find({
      relations: {
        courses: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id },
      relations: {
        courses: true,
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return tutor;
  }

  async update(id: number, dto: UpdateTutorDto) {
    const tutor = await this.findOne(id);

    Object.assign(tutor, dto);

    return this.tutorsRepository.save(tutor);
  }

  async remove(id: number) {
    const tutor = await this.findOne(id);

    await this.tutorsRepository.remove(tutor);

    return {
      message: 'Tutor deleted successfully',
    };
  }
}