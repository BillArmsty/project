import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginRequestDTO {
  @Field(() => String)
  @IsEmail()
  email: string;


  @Field(() => String)
  @IsString()
  password: string;
}
