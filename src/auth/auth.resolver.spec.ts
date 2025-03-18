import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should register a new user', async () => {
    authServiceMock.register = jest
      .fn()
      .mockResolvedValue({ access_token: 'token' });

    const result = await authResolver.register({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toEqual({ access_token: 'token' });
    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
});
