import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';
import { JournalEntry } from './entities/journal.entity';
import * as natural from 'natural';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(private prismaService: PrismaService) {}

  /**
   * Create a new journal entry for a user.
   * @param userId - The ID of the user creating the journal entry.
   * @param data - The data for the new journal entry (title, content, category, tags).
   * @returns The newly created journal entry.
   */
  async create(
    userId: string,
    data: CreateJournalInput,
  ): Promise<JournalEntry> {
    return this.prismaService.journalEntry.create({
      data: { userId, ...data },
    });
  }

  /**
   * Retrieve all journal entries for a specific user with pagination.
   * @param userId - The ID of the user whose journal entries are being fetched.
   * @param page - The page number for pagination.
   * @param limit - The number of entries per page.
   * @returns A paginated list of journal entries belonging to the user.
   */
  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<JournalEntry[]> {
    return this.prismaService.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  /**
   * Retrieve a specific journal entry by ID.
   * @param id - The ID of the journal entry.
   * @param userId - The ID of the user requesting the entry.
   * @returns The requested journal entry.
   * @throws NotFoundException if the entry does not exist or does not belong to the user.
   */
  async findOne(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.prismaService.journalEntry.findUnique({
      where: { id },
    });
    if (!entry || entry.userId !== userId) {
      throw new NotFoundException('Journal entry not found');
    }
    return entry;
  }

  /**
   * Retrieve a heatmap of journal entries for a specific user.
   * @param userId - The ID of the user whose journal entries are being fetched.
   * @returns A list of dates with entry counts for heatmap visualization.
   */
  async getJournalHeatmap(
    userId: string,
  ): Promise<{ date: string; count: number }[]> {
    const entries = await this.prismaService.journalEntry.findMany({
      where: { userId },
      select: { createdAt: true },
    });

    const heatmap: Record<string, number> = {};

    for (const entry of entries) {
      const date = entry.createdAt.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      heatmap[date] = (heatmap[date] || 0) + 1;
    }

    return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
  }

  /**
   * Retrieve the distribution of journal entries by category for a specific user.
   * @param userId - The ID of the user whose journal entries are being fetched.
   * @returns A list of categories with their respective counts.
   */
  async getCategoryDistribution(
    userId: string,
  ): Promise<{ category: string; count: number }[]> {
    const result = await this.prismaService.journalEntry.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { userId },
    });

    return result.map((entry) => ({
      category: entry.category,
      count: entry._count.category,
    }));
  }

  /**
   * Update an existing journal entry.
   * @param userId - The ID of the user updating the entry.
   * @param data - The update data, including the entry ID and any updated fields.
   * @returns The updated journal entry.
   * @throws NotFoundException if the entry does not exist or does not belong to the user.
   */
  async update(
    userId: string,
    data: UpdateJournalInput,
  ): Promise<JournalEntry> {
    const entry = await this.findOne(data.id, userId);
    return this.prismaService.journalEntry.update({
      where: { id: entry.id },
      data,
    });
  }
  /**
   * Analyze word trends from journal entries.
   * @param userId - The ID of the user whose journal entries are analyzed.
   * @param limit - The maximum number of words to retrieve.
   * @returns A list of frequently used words and their counts.
   */
  async getWordTrends(
    userId: string,
    limit: number = 10,
  ): Promise<{ word: string; count: number }[]> {
    const entries = await this.prismaService.journalEntry.findMany({
      where: { userId },
      select: { content: true },
    });

    const tokenizer = new natural.WordTokenizer();
    const wordCounts: Record<string, number> = {};

    for (const entry of entries) {
      if (!entry.content) continue;
      const words = tokenizer.tokenize(entry.content.toLowerCase());
      for (const word of words) {
        if (word.length > 3) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    }

    return Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  /**
   * Retrieve statistics on journal entry lengths.
   * @param userId - The ID of the user whose journal entries are analyzed.
   * @returns The average and maximum journal entry length in words.
   */
  async getEntryLengthStats(
    userId: string,
  ): Promise<{ avgLength: number; maxLength: number }> {
    const entries = await this.prismaService.journalEntry.findMany({
      where: { userId },
      select: { content: true },
    });

    if (entries.length === 0) return { avgLength: 0, maxLength: 0 };

    const lengths = entries.map(
      (entry) => entry.content?.split(' ').length || 0,
    );
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const maxLength = Math.max(...lengths);

    return { avgLength, maxLength };
  }

  /**
   * Retrieve the time of day analysis for journal entries.
   * @param userId - The ID of the user whose journal entries are analyzed.
   * @returns A list of hours with entry counts.
   */
  async getTimeOfDayAnalysis(
    userId: string,
  ): Promise<{ hour: number; count: number }[]> {
    const entries = await this.prismaService.journalEntry.findMany({
      where: { userId },
      select: { createdAt: true },
    });

    const hourlyCounts: Record<number, number> = {};

    for (const entry of entries) {
      const hour = new Date(entry.createdAt).getHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    }

    return Object.entries(hourlyCounts)
      .map(([hour, count]) => ({ hour: Number(hour), count }))
      .sort((a, b) => a.hour - b.hour);
  }

  /**
   * Delete a journal entry.
   * @param id - The ID of the journal entry to delete.
   * @param userId - The ID of the user requesting the deletion.
   * @returns True if deletion was successful.
   * @throws NotFoundException if the entry does not exist or does not belong to the user.
   */
  async remove(id: string, userId: string): Promise<boolean> {
    const entry = await this.findOne(id, userId);
    await this.prismaService.journalEntry.delete({ where: { id: entry.id } });
    return true;
  }
}
