import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':courseId')
  async enroll(
    @Req() req: any,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.enroll(
      req.user.id,
      Number(courseId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async myEnrollments(@Req() req: any) {
    return this.enrollmentsService.getUserEnrollments(
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':courseId')
  async getEnrollment(
    @Req() req: any,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.getEnrollment(
      req.user.id,
      Number(courseId),
    );
  }
}