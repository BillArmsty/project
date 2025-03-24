import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { LoginRequestDTO } from './dto/login-request.dto';
import { Public } from './decorators/public.decorator';
import { Get, Res } from '@nestjs/common';
import { Response } from 'express';

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
  @Mutation(() => LoginResponseDTO)
  async login(
    @Args('loginInput') loginInput: LoginRequestDTO,
    @Context() ctx: any,
  ): Promise<LoginResponseDTO> {
    const { access_token, user, refresh_token } =
      await this.authService.login(loginInput);

    const res = ctx.res;

    if (!res || typeof res.cookie !== 'function') {
      throw new Error("Invalid context: 'res' not available.");
    }

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return { access_token, user, refresh_token };
  }

  @Public()
  @Mutation(() => LoginResponseDTO, {
    description: 'Refresh the access token using refresh token from cookie.',
  })
  async refreshToken(@Context() ctx: any): Promise<LoginResponseDTO> {
    const req = ctx.req;
    const res = ctx.res;
  
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new Error('Missing refresh token');
  
    const { access_token, refresh_token: newRefreshToken, user } =
      await this.authService.validateRefreshToken(refreshToken);
  
    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
  
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  
    return { access_token, refresh_token: newRefreshToken, user };
  }
}
