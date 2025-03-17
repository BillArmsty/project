import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateJournalInput } from './create-journal.input';
import { Category } from '@prisma/client'

@InputType()
export class UpdateJournalInput extends PartialType(CreateJournalInput) {
  @Field()
  id: string;

  @Field(() => Category, { nullable: true })
  category?: Category;
}
