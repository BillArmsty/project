import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterRequestDTO {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
