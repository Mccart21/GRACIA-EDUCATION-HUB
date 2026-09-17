import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(dto: CreateFeedbackDto) {
    const feedback = this.feedbackRepository.create(dto);

    return this.feedbackRepository.save(feedback);
  }

  async findAll() {
    return this.feedbackRepository.find({
      relations: {
        user: true,
        course: true,
        subject: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}