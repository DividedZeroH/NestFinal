import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryInput,
  Category,
  UpdateCategoryInput,
  CategoryEntity,
} from './category.types';
export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | undefined>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: number, input: UpdateCategoryInput): Promise<Category | undefined>;
  remove(id: number): Promise<Category | undefined>;
  hasProducts(categoryId: number): Promise<boolean>;
}

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private repo: Repository<CategoryEntity>
  ) { }

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findById(id: number): Promise<Category | undefined> {
    return this.repo.findOneBy({ id }).then(e => e ?? undefined);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    return this.repo.save(this.repo.create(input));
  }

  async update(id: number, input: UpdateCategoryInput): Promise<Category | undefined> {
    const category = await this.repo.findOneBy({ id });
    if (!category) return undefined;
    Object.assign(category, input);
    return this.repo.save(category);
  }

  async remove(id: number): Promise<Category | undefined> {
    const category = await this.repo.findOneBy({ id });
    if (!category) return undefined;
    await this.repo.remove(category);
    return category;
  }

  async hasProducts(categoryId: number): Promise<boolean> {
    const result = await this.repo.query(
      'SELECT COUNT(*) as count FROM products WHERE categoryId = ?',
      [categoryId],
    );
    const count = result[0]?.count || 0;
    return parseInt(count) > 0;
  }
}
