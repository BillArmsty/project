import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('refresh-token')
  refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    try {
      const newAccessToken =
        this.authService.validateRefreshToken(refreshToken);
      return res.json({ access_token: newAccessToken });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
}
