import { User } from '@prisma/client';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserEntity implements User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  createdAt: Date;
}
