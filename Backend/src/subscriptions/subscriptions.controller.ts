import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * Public endpoint.
   *
   * The subscription page can load plans
   * without requiring the student to log in first.
   */
  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  /**
   * Get one subscription plan.
   */
  @Get('plans/:id')
  async getPlan(
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.getPlan(
      Number(id),
    );
  }

  /**
   * Get subscriptions belonging to
   * the currently authenticated student.
   */
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMySubscriptions(
    @Req() req: any,
  ) {
    return this.subscriptionsService.getUserSubscriptions(
      req.user.id,
    );
  }

  /**
   * Get the currently active subscription
   * for the authenticated student.
   */
  @UseGuards(JwtAuthGuard)
  @Get('active')
  async getActiveSubscription(
    @Req() req: any,
  ) {
    return this.subscriptionsService.getActiveSubscription(
      req.user.id,
    );
  }
}