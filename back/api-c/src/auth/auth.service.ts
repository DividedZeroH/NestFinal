import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../users/dtos/login.dto';
import { RegisterDto } from '../users/dtos/register.dto';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: UserEntity; access_token: string }> {
    const user = await this.usersService.register(dto);
    const accessToken = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });
    return { user, access_token: accessToken };
  }

  async login(dto: LoginDto): Promise<{ user: UserEntity; access_token: string }> {
    const user = await this.usersService.login(dto);
    const accessToken = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    return { user, access_token: accessToken };
  }
}
