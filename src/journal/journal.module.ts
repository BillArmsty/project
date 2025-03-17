import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalResolver } from './journal.resolver';

@Module({
  providers: [JournalResolver, JournalService],
})
export class JournalModule {}
