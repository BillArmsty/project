import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Email of the user' })
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  password: string;

  @Field(() => Role, { nullable: true, description: 'Role of the user' })
  role?: Role;
}
