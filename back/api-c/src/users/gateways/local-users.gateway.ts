import { Injectable } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalUsersGateway implements UsersGateway {
    async fetchAll(): Promise<ExternalUser[]> {
        const filePath = path.join(process.cwd(), 'src/users/data/users.json');
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }

    async fetchById(id: number): Promise<ExternalUser> {
        const users = await this.fetchAll();
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return user;
    }
}
