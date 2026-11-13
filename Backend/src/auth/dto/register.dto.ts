
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { Match } from '../validators/match.decorator';
import { EOF } from 'dns/promises';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(['primary', 'secondary', 'tertiary', 'skills'])
  level!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(6)
  @Validate(Match, ['password'])
  confirmPassword!: string;
}
