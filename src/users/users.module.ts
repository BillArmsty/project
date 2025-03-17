import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserService, UserResolver],
  imports: [PrismaModule],
  exports:[UserService]
})
export class UserModule {}


