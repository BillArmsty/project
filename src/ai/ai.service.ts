import { Injectable, Logger } from '@nestjs/common';
import { HfInference, InferenceClient } from '@huggingface/inference';
import { AiResponse } from '../ai/dto/ai-response';

@Injectable()
export class AiService {
  private readonly hf: InferenceClient;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    const token = process.env.HUGGINGFACE_API_KEY;
    if (!token) {
      this.logger.error('Missing HUGGINGFACE_API_KEY in environment variables');
      throw new Error('Missing Hugging Face API token');
    }

    this.hf = new HfInference(token);
  }

  async generateFromJournal(content: string): Promise<AiResponse> {
    const models = [
      'mistralai/Mistral-7B-Instruct-v0.1',
      'tiiuae/falcon-7b-instruct',
      'openchat/openchat-3.5-0106',
    ];

    const prompt = `Based on the following journal entry, suggest thoughtful continuations or elaborations that could enrich the reflection:\n\n"""${content}"""`;

    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    for (const model of models) {
      try {
        const response = await this.hf.chatCompletion({
          model,
          messages,
          max_tokens: 256,
          temperature: 0.7,
        });

        const generatedText = response?.choices?.[0]?.message?.content ?? '';
        return {
          summary: generatedText.trim(),
          mood: 'N/A',
          sentiment: 'N/A',
        };
      } catch (error) {
        this.logger.warn(`Model ${model} failed: ${error.message}`);
      }
    }

    // Fallback response
    return {
      summary: 'AI text generation failed. Please try again later.',
      mood: 'Unknown',
      sentiment: 'Unknown',
    };
  }
}
