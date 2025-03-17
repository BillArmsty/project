import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginRequestDTO {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
