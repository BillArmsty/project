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

  @Public()
  @Mutation(() => RegisterResponseDTO)
  async register(
    @Args('registerInput') registerInput: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    return this.authService.register(registerInput);
  }

  @Public()
  @Mutation(() => LoginResponseDTO)
  async login(
    @Args('loginInput') loginInput: LoginRequestDTO,
  ): Promise<LoginResponseDTO> {
    return this.authService.login(loginInput);
  }


}
