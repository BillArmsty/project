import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AiService } from './ai.service';
import { AiResponse } from '../ai/dto/ai-response';
import { AnalyzeJournalInput } from './dto/analyze-journal.input';

@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Mutation(() => AiResponse)
  async analyzeJournal(
    @Args('input') input: AnalyzeJournalInput,
  ): Promise<AiResponse> {
    return this.aiService.generateFromJournal(input.content);
  }
}
