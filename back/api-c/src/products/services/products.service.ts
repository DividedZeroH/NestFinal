import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';
import { PaginationParams } from '../../common/pagination.types';
import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../../categories/categories.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) { }

  async findAll(params: PaginationParams) {
    return this.productsRepository.findAll(params);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const category = await this.categoriesRepository.findById(input.categoryId);
    if (!category) {
      throw new BadRequestException(`Category with ID ${input.categoryId} does not exist`);
    }
    return this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    if (input.categoryId) {
      const category = await this.categoriesRepository.findById(input.categoryId);
      if (!category) {
        throw new BadRequestException(`Category with ID ${input.categoryId} does not exist`);
      }
    }
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productsRepository.findByCategory(categoryId);
  }

  async reduceStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    
    return this.productsRepository.reduceStock(id, quantity) as Promise<Product>;
  }
}
