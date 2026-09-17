import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(dto: CreateSubscriptionDto) {
    const subscription =
      this.subscriptionsRepository.create(dto);

    return this.subscriptionsRepository.save(subscription);
  }

  async findAll() {
    return this.subscriptionsRepository.find({
      where: {
        isActive: true,
      },
      order: {
        price: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const subscription =
      await this.subscriptionsRepository.findOne({
        where: { id },
      });

    if (!subscription) {
      throw new NotFoundException(
        'Subscription not found',
      );
    }

    return subscription;
  }

  async update(
    id: number,
    dto: UpdateSubscriptionDto,
  ) {
    const subscription = await this.findOne(id);

    Object.assign(subscription, dto);

    return this.subscriptionsRepository.save(subscription);
  }

  async remove(id: number) {
    const subscription = await this.findOne(id);

    await this.subscriptionsRepository.remove(subscription);

    return {
      message: 'Subscription deleted successfully',
    };
  }
}