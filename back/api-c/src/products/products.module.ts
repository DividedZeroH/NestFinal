import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmProductsRepository } from './repositories/typeorm-products.repository';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { ProductsService } from './services/products.service';
import { ProductEntity } from './product.types';
import { CategoriesModule } from '../categories/categories.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: TypeOrmProductsRepository },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule { }
