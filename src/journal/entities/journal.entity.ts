import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class JournalEntry {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  category: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
