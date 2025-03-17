import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateJournalInput) {
    return this.prisma.journalEntry.create({
      data: { userId, ...data },
    });
  }

  async findAll(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const entry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== userId) throw new NotFoundException('Journal not found');
    return entry;
  }

  async update(userId: string, data: UpdateJournalInput) {
    const entry = await this.findOne(data.id, userId);
    return this.prisma.journalEntry.update({
      where: { id: entry.id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const entry = await this.findOne(id, userId);
    return this.prisma.journalEntry.delete({ where: { id: entry.id } });
  }
}
