import { InputType, Field } from '@nestjs/graphql';
import { Category } from '@prisma/client'

@InputType()
export class CreateJournalInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Category)
  category: Category;
}
