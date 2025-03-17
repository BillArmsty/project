import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateJournalInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
