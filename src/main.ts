import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [
      'log',
      'error',
      'warn',
      // 'debug', 'verbose'
    ],
  });

  // Set up global validation pipe for input validation and logging
  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('Bootstrap');

  logger.log('Starting Journal Backend...');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.enableCors();

  // Log each incoming request for debugging
  app.use((req: Request, res: any, next: any) => {
    logger.debug(`Incoming Request: ${req.method} ${req.url}`);
    res.on('finish', () => {
      logger.verbose(
        `Request Status: ${req.method} ${req.url} - ${res.statusCode}`,
      );
    });
    next();
  });

  await app.listen(8080);
  logger.log('Journal Backend HTTP server listening on port 3000');
}

bootstrap();
