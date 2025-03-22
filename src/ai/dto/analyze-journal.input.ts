import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AnalyzeJournalInput {
  @Field()
  content: string;
}
