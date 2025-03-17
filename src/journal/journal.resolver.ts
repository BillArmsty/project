import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalEntry } from '../journal/entities/journal.entity';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

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
  @UseGuards(JwtAuthGuard)
  createJournalEntry(
    @Args('data') data: CreateJournalInput,
    @CurrentUser() user: UserEntity,
  ): Promise<JournalEntry> {
    return this.journalService.create(user.id, data);
  }

  /**
   * Query to fetch all journal entries for the authenticated user.
   * @param user - The authenticated user.
   * @returns A list of journal entries.
   */
  @Query(() => [JournalEntry], {
    description: 'Fetch all journal entries for the authenticated user',
  })
  @UseGuards(JwtAuthGuard)
  getJournalEntries(@CurrentUser() user: UserEntity,): Promise<JournalEntry[]> {
    return this.journalService.findAll(user.id);
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
    @Args('id') id: string,
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
   * Mutation to delete a journal entry.
   * @param id - The ID of the journal entry to delete.
   * @param user - The authenticated user.
   * @returns True if deletion was successful.
   */
  @Mutation(() => Boolean, { description: 'Delete a journal entry' })
  @UseGuards(JwtAuthGuard)
  deleteJournalEntry(
    @Args('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<boolean> {
    return this.journalService.remove(id, user.id);
  }
}
