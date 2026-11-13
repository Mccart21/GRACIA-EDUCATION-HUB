
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { Tutor } from './entities/tutor.entity';
import { Course } from '../courses/entities/course.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Course]),
    AuthModule,
  ],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
