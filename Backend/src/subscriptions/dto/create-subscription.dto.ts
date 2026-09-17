import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { SubscriptionPlan } from '../../common/enums';

export class CreateSubscriptionDto {
  @IsString()
  name: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  isActive?: boolean;
}