import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
  ReduceStockInput,
} from '../product.types';
import { PaginationParams } from '../../common/pagination.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(@Query() params: PaginationParams) {
    return this.productsService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductInput): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  async reduceStock(@Param('id') id: string, @Body() body: ReduceStockInput): Promise<Product> {
    return this.productsService.reduceStock(Number(id), body.quantity);
  }
}
