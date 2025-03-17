import { Injectable } from '@nestjs/common';
import { CreateJournalInput } from './dto/create-journal.input';
import { UpdateJournalInput } from './dto/update-journal.input';

@Injectable()
export class JournalService {
  create(createJournalInput: CreateJournalInput) {
    return 'This action adds a new journal';
  }

  findAll() {
    return `This action returns all journal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} journal`;
  }

  update(id: number, updateJournalInput: UpdateJournalInput) {
    return `This action updates a #${id} journal`;
  }

  remove(id: number) {
    return `This action removes a #${id} journal`;
  }
}
