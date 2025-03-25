import { Resolver, Mutation, Args, Query, Context, Int } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ChangePasswordInput } from './dto/change-password.input';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => UserEntity)
  async changeUserRole(
    @Args('id') id: string,
    @Args('newRole', { type: () => Role }) newRole: Role,
    @Context() context: any,
  ): Promise<UserEntity> {
    const currentUser = context.user;

    // Check if the current user is  SUPERADMIN
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to change user roles',
      );
    }

    return this.userService.updateUserRole(id, newRole);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: { id: string },
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.userService.changePassword(user.id, input);
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: { id: string }) {
    return this.userService.findById(user.id);
  }

  @Query(() => [UserEntity])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getAllUsers(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Query(() => [UserEntity])
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async getUsersWithJournals(
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('includeEmpty', { type: () => Boolean, nullable: true }) includeEmpty = true,
  ): Promise<UserEntity[]> {
    return (
      await this.userService.findUsers({
        take,
        skip,
        includeEmpty,
      })
    ).map((user) => ({
      ...user,
      entries: user.entries.map((entry) => ({
        ...entry,
        tags: (entry as any).tags || [],
      })),
    }));
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }

  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async removeUser(@Args('email') email: string) {
    return this.userService.remove(email);
  }
}
