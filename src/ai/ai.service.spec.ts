import { AiService } from './ai.service';
import { HfInference } from '@huggingface/inference';

jest.mock('@huggingface/inference');

describe('AiService', () => {
  let service: AiService;
  const mockChatCompletion = jest.fn();

  beforeEach(() => {
    process.env.HUGGINGFACE_API_KEY = 'fake-key';
    (HfInference as jest.Mock).mockImplementation(() => ({
      chatCompletion: mockChatCompletion,
    }));
    service = new AiService();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.HUGGINGFACE_API_KEY;
  });

  it('returns generated content from the first successful model', async () => {
    mockChatCompletion.mockResolvedValueOnce({
      choices: [{ message: { content: ' Enriched reflection here. ' } }],
    });

    const result = await service.generateFromJournal('Journal content...');
    expect(result).toEqual({
      summary: 'Enriched reflection here.',
      mood: 'N/A',
      sentiment: 'N/A',
    });
    expect(mockChatCompletion).toHaveBeenCalledTimes(1);
  });

  it('falls back if all models fail', async () => {
    mockChatCompletion.mockRejectedValue(new Error('Model failed'));

    const result = await service.generateFromJournal('Bad day...');
    expect(result).toEqual({
      summary: 'AI text generation failed. Please try again later.',
      mood: 'Unknown',
      sentiment: 'Unknown',
    });
    expect(mockChatCompletion).toHaveBeenCalledTimes(3);
  });

  it('throws if API key is missing', () => {
    delete process.env.HUGGINGFACE_API_KEY;
    expect(() => new AiService()).toThrow('Missing Hugging Face API token');
  });
});
