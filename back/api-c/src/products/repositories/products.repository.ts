import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { PaginatedResult, PaginationParams } from '../../common/pagination.types';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<Product>>;
  findById(id: number): Promise<Product | undefined>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: number, input: UpdateProductInput): Promise<Product | undefined>;
  remove(id: number): Promise<Product | undefined>;
  findByCategory(categoryId: number): Promise<Product[]>;
  reduceStock(id: number, quantity: number): Promise<Product | undefined>;
}
