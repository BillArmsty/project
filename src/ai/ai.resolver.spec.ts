import { Test, TestingModule } from '@nestjs/testing';
import { AiResolver } from './ai.resolver';
import { AiService } from './ai.service';
import { AnalyzeJournalInput } from './dto/analyze-journal.input';

describe('AiResolver', () => {
  let resolver: AiResolver;
  let aiServiceMock: Partial<AiService>;

  beforeEach(async () => {
    aiServiceMock = {
      generateFromJournal: jest.fn().mockResolvedValue({
        summary: 'AI summary here.',
        mood: 'N/A',
        sentiment: 'N/A',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiResolver,
        { provide: AiService, useValue: aiServiceMock },
      ],
    }).compile();

    resolver = module.get<AiResolver>(AiResolver);
  });

  it('calls AiService and returns AI response', async () => {
    const input: AnalyzeJournalInput = { content: 'Sample journal content' };
    const result = await resolver.analyzeJournal(input);

    expect(result.summary).toBe('AI summary here.');
    expect(aiServiceMock.generateFromJournal).toHaveBeenCalledWith(input.content);
  });
});
