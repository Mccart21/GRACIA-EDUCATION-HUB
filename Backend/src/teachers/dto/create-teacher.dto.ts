
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName!: string;

  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsIn(['primary', 'secondary'])
  level!: string;

  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}
