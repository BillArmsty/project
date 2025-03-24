import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ChangePasswordInput } from './dto/change-password.input';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async createUser(createUserInput: CreateUserInput) {
    const { email, password, role } = createUserInput;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email Is Already Registered');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        password,
        role,
      },
    });

    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findUsersWithJournalsOnly({ take, skip }): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      where: {
        entries: {
          some: {},
        },
      },
      include: {
        entries: true,
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });
  }


  async findUsers({
    take,
    skip,
    includeEmpty = false,
  }: {
    take?: number;
    skip?: number;
    includeEmpty?: boolean;
  }) {
    return this.prismaService.user.findMany({
      where: includeEmpty
        ? {}
        : {
            entries: {
              some: {}, 
            },
          },
      include: {
        entries: true,
      },
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });
    if (!user) throw new BadRequestException(`User with ID #${id} not found`);
    return user;
  }

  async findOne(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },

      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return null;
    }
    // throw new BadRequestException(`User with email #${email} not found`);

    return user;
  }

  async updateUserRole(id: string, newRole: Role): Promise<UserEntity> {
    return this.prismaService.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (
      !user ||
      !(await bcrypt.compare(input.currentPassword, user.password))
    ) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(input.newPassword, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return true;
  }

  async remove(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      throw new BadRequestException(`User with email #${email} not found`);

    return this.prismaService.user.delete({ where: { email } });
  }
}
