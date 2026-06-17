import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
  ProductEntity,
} from '../product.types';
import { ProductsRepository } from './products.repository';
import { PaginatedResult, PaginationParams } from '../../common/pagination.types';

@Injectable()
export class TypeOrmProductsRepository
  implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private repo: Repository<ProductEntity>
  ) { }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Product>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const queryBuilder = this.repo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .skip(skip)
      .take(limit);

    if (params.name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${params.name}%` });
    }

    if (params.sortBy) {
      queryBuilder.orderBy(`product.${params.sortBy}`, params.order?.toUpperCase() as 'ASC' | 'DESC' || 'ASC');
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResult(data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  findById(id: number): Promise<Product | undefined> {
    return this.repo.findOne({ where: { id }, relations: ['category'] })
      .then(e => e ?? undefined);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.repo.create(input);
    return this.repo.save(product);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    const product = await this.repo.findOneBy({ id });
    if (!product) return undefined;
    Object.assign(product, input);
    return this.repo.save(product);
  }

  async remove(id: number): Promise<Product | undefined> {
    const product = await this.repo.findOneBy({ id });
    if (!product) return undefined;
    await this.repo.remove(product);
    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.repo.find({ where: { categoryId } });
  }

  async reduceStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = await this.repo.findOneBy({ id });
    if (!product) return undefined;
    
    product.stock -= quantity;
    if (product.stock < 0) product.stock = 0; // Opcional: manejar validación en service
    
    return this.repo.save(product);
  }
}
