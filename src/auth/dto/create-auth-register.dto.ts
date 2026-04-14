import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateAuthRegisterDto {
  @IsEmail()
  email?: string;

  @IsString()
  @MaxLength(32)
  firstName?: string;

  @IsString()
  @MaxLength(32)
  lastName?: string;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @MinLength(6)
  confirmPassword?: string;
}