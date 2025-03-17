import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginRequestDTO {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;
}
