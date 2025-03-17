import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { Category } from '@prisma/client';
registerEnumType(Category, { name: 'Category' });

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

  @Field(() => Category)
  category: Category;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
