import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PaymentMethod } from '../../common/enums';

export class CreatePaymentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  subscriptionId: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  phone?: string;
}