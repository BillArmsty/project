import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateJournalInput } from './create-journal.input';

@InputType()
export class UpdateJournalInput extends PartialType(CreateJournalInput) {
  @Field()
  id: string;
}
