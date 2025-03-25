import { InputType, Field } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateJournalInput {
  @Field()
  @IsString()
  @MinLength(3)
  title: string;

  @Field()
  @IsString()
  @MinLength(5)
  content: string;

  @Field(() => Category)
  @IsString()
  category: Category;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
