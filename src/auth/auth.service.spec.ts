import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { jest } from '@jest/globals';
import { Role } from '@prisma/client';
import e from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  let userServiceMock: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtServiceMock: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userServiceMock = {
      findOne: jest
        .fn<() => Promise<UserEntity | null>>()
        .mockResolvedValue(null),
      createUser: jest.fn<() => Promise<UserEntity>>().mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        createdAt: new Date(),
      }),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mocked_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = await module.resolve<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    userServiceMock.findOne = jest
      .fn<() => Promise<UserEntity | null>>()
      .mockResolvedValue(null);
    userServiceMock.createUser = jest
      .fn<() => Promise<UserEntity>>()
      .mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        createdAt: new Date(),
      });

    const result = await authService.register({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({
      access_token: 'mocked_token',
      user: {
        id: '123',
        email: 'test@example.com',
        role: expect.any(String),
        createdAt: expect.any(Date),
      },
    });
  });

  it('should throw an error when registering an existing user', async () => {
    userServiceMock.findOne = jest
      .fn<() => Promise<UserEntity>>()
      .mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        createdAt: new Date(),
      });

    await expect(
      authService.register({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
