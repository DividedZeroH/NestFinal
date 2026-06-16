import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ExternalUser } from '../user.types';
import { USERS_GATEWAY, UsersGateway } from '../gateways/users.gateway';
import { UsersRepository } from '../repositories/users.repository';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.usersGateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findOne(id: number): Promise<ExternalUser> {
    try {
      return await this.usersGateway.fetchById(id);
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findAllRegistered(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const email = registerDto.email.trim().toLowerCase();

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const rounds = Number(this.configService.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(registerDto.password, rounds);

    const countUsers = await this.usersRepository.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const verificationToken = crypto.randomUUID();

    const entity = await this.usersRepository.create({
      email,
      passwordHash,
      role,
      verificationToken,
      isVerified: false,
    });

    const saved = await this.usersRepository.save(entity);

    await this.emailService.sendVerificationEmail(email, verificationToken);

    const { passwordHash: _passwordHash, verificationToken: _verificationToken, ...publicUser } = saved;
    return publicUser as UserEntity;
  }

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const email = loginDto.email.trim().toLowerCase();

    // Buscar usuario con passwordHash
    const user = await this.usersRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña
    const ok = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async updateRole(id: string, role: UserRole): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.role = role;
    return this.usersRepository.save(user);
  }

  async verifyEmail(token: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const user = await this.usersRepository.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);
  }

  async resendVerification(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const verificationToken = crypto.randomUUID();
    user.verificationToken = verificationToken;
    await this.usersRepository.save(user);

    await this.emailService.sendVerificationEmail(user.email, verificationToken);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email.trim().toLowerCase());
    if (!user) {
      // Retornar silenciosamente para evitar filtrado de emails registrados
      return;
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hora

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.usersRepository.save(user);

    await this.emailService.sendResetPasswordEmail(user.email, token);
  }

  async resetPassword(token: string, newPass: string): Promise<void> {
    if (!token) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const user = await this.usersRepository.findByResetPasswordToken(token);
    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const rounds = Number(this.configService.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPass, rounds);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepository.save(user);
  }

  async updatePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(currentPass, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const rounds = Number(this.configService.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPass, rounds);
    await this.usersRepository.save(user);
  }

  async updateEmail(userId: string, newEmail: string, currentPass: string): Promise<UserEntity> {
    const emailNormalized = newEmail.trim().toLowerCase();
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(currentPass, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    if (user.email === emailNormalized) {
      return user;
    }

    const existingUser = await this.usersRepository.findByEmail(emailNormalized);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado por otro usuario');
    }

    const verificationToken = crypto.randomUUID();
    user.email = emailNormalized;
    user.isVerified = false;
    user.verificationToken = verificationToken;
    const saved = await this.usersRepository.save(user);

    await this.emailService.sendVerificationEmail(emailNormalized, verificationToken);

    const { passwordHash: _, verificationToken: __, ...publicUser } = saved;
    return publicUser as UserEntity;
  }
}
