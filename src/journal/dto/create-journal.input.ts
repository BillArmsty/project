import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateJournalInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  category: string;
}
