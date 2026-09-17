import {
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { EnrollmentStatus } from '../../common/enums';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @IsOptional()
  @IsNumber()
  subjectId?: number;
}