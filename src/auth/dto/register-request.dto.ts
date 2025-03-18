import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterRequestDTO {
  @Field(() => String)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Field(() => String)
  password: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
