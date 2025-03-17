import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalEntry } from '../journal/entities/journal.entity';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Resolver(() => JournalEntry)
export class JournalResolver {
  constructor(private readonly journalService: JournalService) {}

  @Mutation(() => JournalEntry)
  @UseGuards(JwtAuthGuard)
  createJournalEntry(@Args('data') data: CreateJournalInput, @CurrentUser() user: UserEntity) {
    return this.journalService.create(user.id, data);
  }

  @Query(() => [JournalEntry])
  @UseGuards(JwtAuthGuard)
  getJournalEntries(@CurrentUser() user: UserEntity) {
    return this.journalService.findAll(user.id);
  }

  @Query(() => JournalEntry)
  @UseGuards(JwtAuthGuard)
  getJournalEntry(@Args('id') id: string, @CurrentUser() user: UserEntity) {
    return this.journalService.findOne(id, user.id);
  }

  @Mutation(() => JournalEntry)
  @UseGuards(JwtAuthGuard)
  updateJournalEntry(@Args('data') data: UpdateJournalInput, @CurrentUser() user: UserEntity) {
    return this.journalService.update(user.id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteJournalEntry(@Args('id') id: string, @CurrentUser() user: UserEntity) {
    return this.journalService.remove(id, user.id).then(() => true);
  }
}
