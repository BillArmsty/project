import { Role, User } from '@prisma/client';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

registerEnumType(Role, {
  name: 'Role',
  description: 'The roles a user can have',
});

@ObjectType()
export class UserEntity implements User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  password: string;

  @Field()
  createdAt: Date;
}
