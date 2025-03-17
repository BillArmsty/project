import {
  Injectable,
  NotFoundException,
  Logger,
  
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';
import { JournalEntry } from './entities/journal.entity';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(private prismaService: PrismaService) {}

  /**
   * Create a new journal entry for a user.
   * @param userId - The ID of the user creating the journal entry.
   * @param data - The data for the new journal entry.
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
   * Retrieve all journal entries for a specific user.
   * @param userId - The ID of the user whose journal entries are being fetched.
   * @returns A list of journal entries.
   */
  async findAll(userId: string): Promise<JournalEntry[]> {
    return this.prismaService.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
   * Update an existing journal entry.
   * @param userId - The ID of the user updating the entry.
   * @param data - The update data, including the entry ID.
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
