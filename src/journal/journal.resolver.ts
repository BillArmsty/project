import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import { Journal } from './entities/journal.entity';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';

@Resolver(() => Journal)
export class JournalResolver {
  constructor(private readonly journalService: JournalService) {}

  @Mutation(() => Journal)
  createJournal(@Args('createJournalInput') createJournalInput: CreateJournalInput) {
    return this.journalService.create(createJournalInput);
  }

  @Query(() => [Journal], { name: 'journal' })
  findAll() {
    return this.journalService.findAll();
  }

  @Query(() => Journal, { name: 'journal' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.journalService.findOne(id);
  }

  @Mutation(() => Journal)
  updateJournal(@Args('updateJournalInput') updateJournalInput: UpdateJournalInput) {
    return this.journalService.update(updateJournalInput.id, updateJournalInput);
  }

  @Mutation(() => Journal)
  removeJournal(@Args('id', { type: () => Int }) id: number) {
    return this.journalService.remove(id);
  }
}
