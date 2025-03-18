import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { PrismaService } from '../prisma/prisma.service';

describe('JournalService', () => {
  let journalService: JournalService;
  let prismaServiceMock: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prismaServiceMock = {
      journalEntry: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        findFirstOrThrow: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    journalService = module.get<JournalService>(JournalService);
  });

  it('should create a journal entry', async () => {
    prismaServiceMock.journalEntry.create.mockResolvedValue({ id: '123' });

    const result = await journalService.create('user123', {
      title: 'Test',
      content: 'Hello World',
      category: 'OTHER',
    });

    expect(result).toEqual({ id: '123' });
    expect(prismaServiceMock.journalEntry.create).toHaveBeenCalled();
  });
});
