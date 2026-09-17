import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(dto);

    return this.paymentsRepository.save(payment);
  }

  async findAll() {
    return this.paymentsRepository.find({
      relations: {
        user: true,
        subscription: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        subscription: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(
    id: number,
    dto: UpdatePaymentDto,
  ) {
    const payment = await this.findOne(id);

    Object.assign(payment, dto);

    return this.paymentsRepository.save(payment);
  }
}