import { IsEmail, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER
}
