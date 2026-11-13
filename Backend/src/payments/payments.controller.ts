
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @Req() req: { user: { id: number | string } },
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(
      Number(req.user.id),
      createPaymentDto,
    );
  }

  @Get('my')
  findMyPayments(@Req() req: { user: { id: number | string } }) {
    return this.paymentsService.findAllForUser(Number(req.user.id));
  }

  @Get(':id')
  findOne(
    @Req() req: { user: { id: number | string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentsService.findOneForUser(Number(req.user.id), id);
  }
}
