import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput, UpdateCategoryInput } from './category.types';
import { ProductsService } from '../products/services/products.service';
import { PaginationParams } from '../common/pagination.types';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
    ) { }

    @Post()
    create(@Body() createCategoryInput: CreateCategoryInput) {
        return this.categoriesService.create(createCategoryInput);
    }

    @Get()
    findAll(@Query() params: PaginationParams) {
        return this.categoriesService.findAll(params);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findById(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryInput: UpdateCategoryInput) {
        return this.categoriesService.update(+id, updateCategoryInput);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(+id);
    }

    @Get(':id/products')
    findProducts(@Param('id') id: string) {
        return this.productsService.findByCategory(+id);
    }
}
