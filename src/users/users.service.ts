import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async createUser(createUserInput: CreateUserInput) {
    const { email, password } = createUserInput;

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
      },
    });

    return user;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true,
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
        createdAt: true,
      },
    });
    if (!user) {
      return null;
    }
    // throw new BadRequestException(`User with email #${email} not found`);

    return user;
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
