import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { LoginRequestDTO } from './dto/login-request.dto';
import { Public } from './decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param registerInput - The user registration details (email, password).
   * @returns The registered user's details along with a JWT access token.
   */
  @Public()
  @Mutation(() => RegisterResponseDTO, {
    description: 'Register a new user and return an access token.',
  })
  async register(
    @Args('registerInput') registerInput: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return this.authService.register(registerInput);
  }

  /**
   * Logs in a user using email and password.
   * @param loginInput - The user login details (email, password).
   * @returns A JWT access token and user details.
   */
  @Public()
  @Mutation(() => LoginResponseDTO, {
    description: 'Authenticate a user and return an access token.',
  })
  async login(
    @Args('loginInput') loginInput: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return this.authService.login(loginInput);
  }
}
