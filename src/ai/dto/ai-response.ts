import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AiResponse {
  @Field()
  summary: string;

  @Field()
  mood: string;

  @Field()
  sentiment: string
}
