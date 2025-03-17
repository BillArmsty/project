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



@ObjectType()
export class HeatmapData {
  @Field()
  date: string;

  @Field()
  count: number;
}

@ObjectType()
export class CategoryDistributionData {
  @Field()
  category: string;

  @Field()
  count: number;
}

@ObjectType()
export class WordTrendData {
  @Field()
  word: string;

  @Field()
  count: number;
}

@ObjectType()
export class EntryLengthStats {
  @Field()
  avgLength: number;

  @Field()
  maxLength: number;
}

@ObjectType()
export class TimeOfDayData {
  @Field()
  hour: number;

  @Field()
  count: number;
}
