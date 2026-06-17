import { Body, Controller, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user-role.enum';
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { UpdateEmailDto } from '../dtos/update-email.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('placeholder-users')
  findAllPlaceholder(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }

  @Get('placeholder-users/:id')
  findOnePlaceholder(@Param('id') id: string): Promise<ExternalUser> {
    return this.usersService.findOne(+id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllUsers(): Promise<UserEntity[]> {
    return this.usersService.findAllRegistered();
  }

  @Patch('users/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ): Promise<UserEntity> {
    return this.usersService.updateRole(id, dto.role);
  }

  @Patch('users/me/password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Request() req: any,
    @Body() dto: UpdatePasswordDto,
  ) {
    const userId = req.user.id || req.user.sub;
    await this.usersService.updatePassword(userId, dto.currentPassword, dto.newPassword);
    return { message: 'Password updated' };
  }

  @Patch('users/me/email')
  @UseGuards(JwtAuthGuard)
  async updateEmail(
    @Request() req: any,
    @Body() dto: UpdateEmailDto,
  ): Promise<{ message: string }> {
    const userId = req.user.id || req.user.sub;
    await this.usersService.updateEmail(userId, dto.newEmail, dto.password);
    return { message: 'Email updated' };
  }
}
