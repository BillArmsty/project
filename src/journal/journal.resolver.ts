import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import {
  CategoryDistributionData,
  EntryLengthStats,
  HeatmapData,
  JournalEntry,
  TimeOfDayData,
  WordTrendData,
} from '../journal/entities/journal.entity';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Resolver(() => JournalEntry)
export class JournalResolver {
  constructor(private readonly journalService: JournalService) {}

  /**
   * Mutation to create a new journal entry.
   * @param data - The input data for creating a journal entry.
   * @param user - The authenticated user.
   * @returns The newly created journal entry.
   */
  @Mutation(() => JournalEntry, {
    description: 'Create a new journal entry for the authenticated user',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  createJournalEntry(
    @Args('data') data: CreateJournalInput,
    @CurrentUser() user: UserEntity,
  ): Promise<JournalEntry> {
    return this.journalService.create(user.id, data);
  }

  //Query all journals as admin
  /**
   * Query to fetch all journal entries as admin.
   * Supports pagination with optional page and limit parameters.
   * @param page - The page number (default: 1).
   * @param limit - The number of entries per page (default: 10).
   * @returns A paginated list of journal entries.
   * @roles ADMIN
   */
  @Query(() => [JournalEntry])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUserJournals(): Promise<JournalEntry[]> {
    return this.journalService.findAllAdmin();
  }

  /**
   * Query to fetch all journal entries for the authenticated user.
   * Supports pagination with optional page and limit parameters.
   * @param user - The authenticated user.
   * @param page - The page number (default: 1).
   * @param limit - The number of entries per page (default: 10).
   * @returns A paginated list of journal entries.
   */
  @Query(() => [JournalEntry], {
    description:
      'Fetch all journal entries for the authenticated user with pagination',
  })
  @UseGuards(JwtAuthGuard)
  getJournalEntries(
    @CurrentUser() user: UserEntity,
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ): Promise<JournalEntry[]> {
    return this.journalService.findAll(user.id, page, limit);
  }

  /**
   * Query to fetch a single journal entry by ID.
   * @param id - The ID of the journal entry to retrieve.
   * @param user - The authenticated user.
   * @returns The requested journal entry.
   */
  @Query(() => JournalEntry, {
    description: 'Fetch a specific journal entry by ID',
  })
  @UseGuards(JwtAuthGuard)
  getJournalEntry(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<JournalEntry> {
    return this.journalService.findOne(id, user.id);
  }

  /**
   * Mutation to update an existing journal entry.
   * @param data - The input data for updating the journal entry.
   * @param user - The authenticated user.
   * @returns The updated journal entry.
   */
  @Mutation(() => JournalEntry, {
    description: 'Update an existing journal entry',
  })
  @UseGuards(JwtAuthGuard)
  updateJournalEntry(
    @Args('data') data: UpdateJournalInput,
    @CurrentUser() user: UserEntity,
  ): Promise<JournalEntry> {
    return this.journalService.update(user.id, data);
  }

  /**
   * Query to fetch the heatmap data of journal entries by day.
   * @param user - The authenticated user.
   * @returns A list of dates with the number of journal entries for each day.
   */
  @Query(() => [HeatmapData], {
    description: 'Fetch the heatmap data of journal entries by day',
  })
  @UseGuards(JwtAuthGuard)
  getJournalHeatmap(@CurrentUser() user: UserEntity): Promise<HeatmapData[]> {
    return this.journalService.getJournalHeatmap(user.id);
  }

  /**
   * Query to fetch the distribution of journal entries by category.
   * @param user - The authenticated user.
   * @returns A list of categories with their respective journal entry counts.
   */
  @Query(() => [CategoryDistributionData], {
    description: 'Fetch the distribution of journal entries by category',
  })
  @UseGuards(JwtAuthGuard)
  getCategoryDistribution(
    @CurrentUser() user: UserEntity,
  ): Promise<CategoryDistributionData[]> {
    return this.journalService.getCategoryDistribution(user.id);
  }

  /**
   * Query to fetch the most commonly used words in journal entries.
   * @param user - The authenticated user.
   * @param limit - The maximum number of words to retrieve (default: 10).
   * @returns A list of words with their frequency count.
   */
  @Query(() => [WordTrendData], {
    description: 'Fetch the most commonly used words in journal entries',
  })
  @UseGuards(JwtAuthGuard)
  getWordTrends(
    @CurrentUser() user: UserEntity,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ): Promise<WordTrendData[]> {
    return this.journalService.getWordTrends(user.id, limit);
  }

  /**
   * Query to fetch statistics on journal entry lengths.
   * @param user - The authenticated user.
   * @returns The average and maximum journal entry length in words.
   */
  @Query(() => EntryLengthStats, {
    description: 'Fetch statistics on journal entry lengths',
  })
  @UseGuards(JwtAuthGuard)
  getEntryLengthStats(
    @CurrentUser() user: UserEntity,
  ): Promise<EntryLengthStats> {
    return this.journalService.getEntryLengthStats(user.id);
  }

  /**
   * Query to analyze the time of day when journal entries are most frequently written.
   * @param user - The authenticated user.
   * @returns A list of hours with their respective journal entry counts.
   */
  @Query(() => [TimeOfDayData], {
    description:
      'Analyze the time of day when journal entries are most frequently written',
  })
  @UseGuards(JwtAuthGuard)
  getTimeOfDayAnalysis(
    @CurrentUser() user: UserEntity,
  ): Promise<TimeOfDayData[]> {
    return this.journalService.getTimeOfDayAnalysis(user.id);
  }

  /**
   * Mutation to delete a journal entry.
   * @param id - The ID of the journal entry to delete.
   * @param user - The authenticated user.
   * @returns True if deletion was successful.
   */
  @Mutation(() => Boolean, { description: 'Delete a journal entry' })
  @UseGuards(JwtAuthGuard)
  deleteJournalEntry(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<boolean> {
    return this.journalService.remove(id, user.id);
  }
}
