import { CreateJournalInput } from './create-journal.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateJournalInput extends PartialType(CreateJournalInput) {
  @Field(() => Int)
  id: number;
}
