import { Role, User } from '@prisma/client';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { JournalEntry } from '../../journal/entities/journal.entity';

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

  @Field(() => [JournalEntry], { nullable: true })
  entries?: JournalEntry[];


  password: string;

  @Field()
  createdAt: Date;
}
