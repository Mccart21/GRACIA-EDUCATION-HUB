
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';
import { UserSubscription } from '../subscriptions/entities/user-subscription.entity';
import { Course } from '../courses/entities/course.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(userId: number, dto: CreatePaymentDto) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException('Invalid authenticated user.');
    }

    const planId = Number(dto.planId);
    const courseId =
      dto.courseId === undefined || dto.courseId === null
        ? null
        : Number(dto.courseId);
    const subjectId =
      dto.subjectId === undefined || dto.subjectId === null
        ? null
        : Number(dto.subjectId);

    if (!Number.isInteger(planId) || planId <= 0) {
      throw new BadRequestException('A valid subscription plan is required.');
    }

    if (courseId !== null && (!Number.isInteger(courseId) || courseId <= 0)) {
      throw new BadRequestException('Invalid course ID.');
    }

    if (
      subjectId !== null &&
      (!Number.isInteger(subjectId) || subjectId <= 0)
    ) {
      throw new BadRequestException('Invalid subject ID.');
    }

    if (courseId !== null && subjectId !== null) {
      throw new BadRequestException(
        'Select either a course or a subject, not both.',
      );
    }

    const selectedProvider = String(
      dto.provider ?? '',
    )
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

    const providers: Record<string, string> = {
      'airtel money': 'Airtel Money',
      airtel: 'Airtel Money',
      'tnm mpamba': 'TNM Mpamba',
      mpamba: 'TNM Mpamba',
      'national bank of malawi': 'National Bank of Malawi',
      'national bank': 'National Bank of Malawi',
      nbm: 'National Bank of Malawi',
      'nbs bank': 'NBS Bank',
      nbs: 'NBS Bank',
    };

    const provider = providers[selectedProvider];

    if (!provider) {
      throw new BadRequestException(
        'Choose Airtel Money, TNM Mpamba, National Bank of Malawi, or NBS Bank.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const planRepository = manager.getRepository(SubscriptionPlan);
      const subscriptionRepository = manager.getRepository(UserSubscription);
      const courseRepository = manager.getRepository(Course);
      const subjectRepository = manager.getRepository(Subject);
      const paymentRepository = manager.getRepository(Payment);

      const plan = await planRepository.findOne({
        where: { id: planId, isActive: 1 },
      });

      if (!plan) {
        throw new NotFoundException('The subscription plan is unavailable.');
      }

      if (!Number.isFinite(Number(plan.price)) || Number(plan.price) < 0) {
        throw new BadRequestException('The subscription plan has an invalid price.');
      }

      if (courseId !== null) {
        const course = await courseRepository.findOne({
          where: { id: courseId },
        });

        if (!course) {
          throw new NotFoundException('The selected course was not found.');
        }
      }

      if (subjectId !== null) {
        const subject = await subjectRepository.findOne({
          where: { id: subjectId },
        });

        if (!subject) {
          throw new NotFoundException('The selected subject was not found.');
        }
      }

      const subscription = subscriptionRepository.create({
        userId,
        planId: plan.id,
        status: 'pending',
        startsAt: null,
        expiresAt: null,
        paymentReference: null,
      });

      const savedSubscription = await subscriptionRepository.save(subscription);

      const payment = paymentRepository.create({
        userId,
        subscriptionId: savedSubscription.id,
        planId: plan.id,
        amount: Number(plan.price),
        currency: 'MWK',
        paymentMethod: provider.includes('Bank') ? 'bank' : 'mobile_money',
        provider,
        transactionReference: null,
        status: 'pending',
        courseId,
        subjectId,
      });

      const savedPayment = await paymentRepository.save(payment);

      return {
        message:
          'Payment request created. Your payment is pending provider confirmation.',
        payment: {
          id: savedPayment.id,
          planId: savedPayment.planId,
          subscriptionId: savedPayment.subscriptionId,
          courseId: savedPayment.courseId,
          subjectId: savedPayment.subjectId,
          amount: savedPayment.amount,
          currency: savedPayment.currency,
          provider: savedPayment.provider,
          status: savedPayment.status,
          createdAt: savedPayment.createdAt,
        },
      };
    });
  }

  async findAllForUser(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(userId: number, id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid payment ID.');
    }

    const payment = await this.paymentRepository.findOne({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found.');
    }

    return payment;
  }
}
