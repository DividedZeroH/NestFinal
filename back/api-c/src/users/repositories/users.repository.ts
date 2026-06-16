import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.repo.create(data);
  }

  async save(entity: UserEntity): Promise<UserEntity> {
    return this.repo.save(entity);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repo.find({ order: { email: 'ASC' } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdWithPassword(id: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id })
      .getOne();
  }

  async findByVerificationToken(token: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.verificationToken')
      .where('u.verificationToken = :token', { token })
      .getOne();
  }

  async findByResetPasswordToken(token: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.resetPasswordToken')
      .addSelect('u.resetPasswordExpires')
      .where('u.resetPasswordToken = :token', { token })
      .getOne();
  }
}
