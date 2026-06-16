import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { LoginDto } from '../users/dtos/login.dto';
import { RegisterDto } from '../users/dtos/register.dto';
import { UserEntity } from '../users/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<{ user: UserEntity; access_token: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<{ user: UserEntity; access_token: string }> {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    await this.usersService.verifyEmail(token);
    return { message: 'Email verificado' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verification')
  async resendVerification(@Request() req: any) {
    const userId = req.user.id || req.user.sub;
    await this.usersService.resendVerification(userId);
    return { message: 'Email reenviado' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    const userId = req.user.id || req.user.sub;
    const user = await this.usersService.findById(userId);
    return user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.usersService.forgotPassword(email);
    return { message: 'Si el email existe, recibirás un link' };
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('password') pass: string) {
    await this.usersService.resetPassword(token, pass);
    return { message: 'Contraseña actualizada' };
  }
}
