import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('🪵Public route accessed');
      return true;
    }

    const isActivated = super.canActivate(context);
    this.logger.log(`Guard activated. User should be attached to request.`);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.log('🛡️Validating JWT...🛡️');

    if (err || !user) {
      this.logger.error('❌ Authentication failed❌', err || info);
      return null;
    }

    this.logger.log(`✅Authenticated user: ${JSON.stringify(user)}✅`);
    return user;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    this.logger.debug(`Request cookies: ${JSON.stringify(req.cookies)}`);
    return req;
  }
}
