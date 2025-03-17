import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {  UseGuards } from '@nestjs/common';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }



  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: { id: string }) {
    return this.userService.findById(user.id);
  }

  @Query(() => [UserEntity])
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }



  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Args('email') email: string) {
    return this.userService.remove(email);
  }
}
