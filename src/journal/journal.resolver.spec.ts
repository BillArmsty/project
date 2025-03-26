import { Test, TestingModule } from '@nestjs/testing';
import { JournalResolver } from './journal.resolver';
import { JournalService } from './journal.service';
import { Role } from '@prisma/client';

describe('JournalResolver', () => {
  let journalResolver: JournalResolver;
  let journalServiceMock: Partial<JournalService>;

  beforeEach(async () => {
    journalServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalResolver,
        { provide: JournalService, useValue: journalServiceMock },
      ],
    }).compile();

    journalResolver = module.get<JournalResolver>(JournalResolver);
  });

  it('should create a journal entry', async () => {
    journalServiceMock.create = jest.fn().mockResolvedValue({ id: '123' });

    const userEntityMock = { id: 'user123', email: 'test@example.com', role: Role.USER, password: 'password', createdAt: new Date() };
    const result = await journalResolver.createJournalEntry({ title: 'Test', content: 'Hello' , category: 'OTHER', tags: ["hello", "sample"]}, userEntityMock);

    expect(result).toEqual({ id: '123' });
  });
});
