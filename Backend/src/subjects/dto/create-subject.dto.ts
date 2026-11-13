
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['primary', 'secondary'])
  level!: string;

  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
