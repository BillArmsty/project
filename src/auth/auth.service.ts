import { BadRequestException, Injectable, Scope, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/users.service';
import { RegisterRequestDTO } from '../auth/dto/register-request.dto';
import { LoginRequestDTO } from './dto/login-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { Role } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's login credentials.
   * @param email - The user's email.
   * @param password - The user's plaintext password.
   * @returns The user entity if authentication is successful.
   * @throws BadRequestException if the email or password is incorrect.
   */
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.userService.findOne(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  /**
   * Logs in a user and returns a JWT token.
   * @param loginInput - The user's login details (email, password).
   * @returns An object containing the JWT access token and user details.
   */
  async login(loginInput: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user: UserEntity = await this.validateUser(
      loginInput.email,
      loginInput.password,
    );

    const payload = { email: user.email, sub: user.id , role: user.role};

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Registers a new user, hashes their password, and issues a JWT token.
   * @param registerData - The user's registration details (email, password).
   * @returns An object containing the JWT access token and user details.
   * @throws BadRequestException if the email already exists.
   */
  async register(
    registerData: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    // Check if email already exists
    const existingUser = await this.userService.findOne(registerData.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Create the new user
    const newUser = await this.userService.createUser({
      email: registerData.email,
      password: hashedPassword,
      role: registerData.role  || Role.USER,
    });

    // Generate a JWT token for the new user
    const token = this.jwtService.sign({
      email: newUser.email,
      id: newUser.id,
    });

    return {
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    };
  }
}
