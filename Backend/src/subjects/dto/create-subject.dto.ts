import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { EducationLevel } from '../../common/enums';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EducationLevel)
  level: EducationLevel;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  isActive?: boolean;
}