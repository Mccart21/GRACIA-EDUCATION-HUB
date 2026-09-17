import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsNumber()
  subjectId?: number;
}