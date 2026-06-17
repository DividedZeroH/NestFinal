import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository, CATEGORIES_REPOSITORY } from './categories.repository';
import { CreateCategoryInput, Category, UpdateCategoryInput } from './category.types';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject(CATEGORIES_REPOSITORY)
        private repo: CategoriesRepository,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.repo.findAll();
    }

    async findById(id: number): Promise<Category> {
        const category = await this.repo.findById(id);
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async create(input: CreateCategoryInput): Promise<Category> {
        return this.repo.create(input);
    }

    async update(id: number, input: UpdateCategoryInput): Promise<Category> {
        const category = await this.repo.update(id, input);
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async remove(id: number): Promise<Category> {
        const category = await this.repo.findById(id);
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);

        const hasProducts = await this.repo.hasProducts(id);
        if (hasProducts) {
            throw new ConflictException(`Cannot delete category with ID ${id} because it has associated products`);
        }

        await this.repo.remove(id);
        return category;
    }
}
