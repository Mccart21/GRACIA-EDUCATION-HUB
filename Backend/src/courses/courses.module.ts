import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Course } from './entities/course.entity';
import { Tutor } from '../tutors/entities/tutor.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Tutor])],

  controllers: [CoursesController],

  providers: [CoursesService],

  exports: [CoursesService],
})
export class CoursesModule {}