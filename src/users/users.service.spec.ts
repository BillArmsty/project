import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaServiceMock: Partial<Record<keyof PrismaService, any>>;

  beforeEach(async () => {
    prismaServiceMock = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should find a user by email', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
    });

    const result = await userService.findOne('test@example.com');

    expect(result).toEqual({ id: '123', email: 'test@example.com' });
    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: { id: true, email: true, password: true, role: true, createdAt: true },
    });
  });
});
