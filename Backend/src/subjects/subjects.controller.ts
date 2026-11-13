
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

import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Post(':subjectId/teachers/:teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  assignTeacher(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
  ) {
    return this.subjectsService.assignTeacher(subjectId, teacherId);
  }

  @Delete(':subjectId/teachers/:teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeTeacher(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
  ) {
    return this.subjectsService.removeTeacher(subjectId, teacherId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.remove(id);
  }
}
