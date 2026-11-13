import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { UserSubscription } from './entities/user-subscription.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,

    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Return all active subscription plans.
   *
   * The database is the source of truth.
   */
  async getPlans() {
    const plans = await this.planRepository.find({
      where: {
        isActive: 1,
      },
      order: {
        price: 'ASC',
      },
    });

    return plans.map((plan) => ({
      id: plan.id,
      code: plan.code,
      name: plan.name,
      duration: plan.duration,
      billingPeriod: plan.billingPeriod,
      price: Number(plan.price),
      description: plan.description,
      popular: plan.popular === 1,
      features: this.parseFeatures(plan.features),
    }));
  }

  /**
   * Return one subscription plan.
   */
  async getPlan(id: number) {
    const plan = await this.planRepository.findOne({
      where: {
        id,
        isActive: 1,
      },
    });

    if (!plan) {
      throw new NotFoundException(
        'Subscription plan not found',
      );
    }

    return {
      id: plan.id,
      code: plan.code,
      name: plan.name,
      duration: plan.duration,
      billingPeriod: plan.billingPeriod,
      price: Number(plan.price),
      description: plan.description,
      popular: plan.popular === 1,
      features: this.parseFeatures(plan.features),
    };
  }

  /**
   * Get a user's subscriptions.
   */
  async getUserSubscriptions(userId: number) {
    return this.userSubscriptionRepository.find({
      where: {
        userId,
      },
      relations: {
        plan: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Get the user's currently active subscription.
   */
  async getActiveSubscription(userId: number) {
    return this.userSubscriptionRepository.findOne({
      where: {
        userId,
        status: 'active',
      },
      relations: {
        plan: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private parseFeatures(
    features: string | null,
  ): string[] {
    if (!features) {
      return [];
    }

    try {
      const parsed = JSON.parse(features);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }
}