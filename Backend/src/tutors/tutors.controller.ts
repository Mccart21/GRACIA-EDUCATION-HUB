
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Get()
  findAll() {
    return this.tutorsService.findAll();
  }

  @Post(':tutorId/courses/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  assignCourse(
    @Param('tutorId', ParseIntPipe) tutorId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.tutorsService.assignCourse(tutorId, courseId);
  }

  @Delete(':tutorId/courses/:courseId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeCourse(
    @Param('tutorId', ParseIntPipe) tutorId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.tutorsService.removeCourse(tutorId, courseId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTutorDto: UpdateTutorDto,
  ) {
    return this.tutorsService.update(id, updateTutorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tutorsService.remove(id);
  }
}
