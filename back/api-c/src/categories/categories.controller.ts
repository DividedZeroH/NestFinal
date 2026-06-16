import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput, UpdateCategoryInput } from './category.types';
import { ProductsService } from '../products/services/products.service';
import { PaginationParams } from '../common/pagination.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
    ) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
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
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateCategoryInput: UpdateCategoryInput) {
        return this.categoriesService.update(+id, updateCategoryInput);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(+id);
    }

    @Get(':id/products')
    findProducts(@Param('id') id: string) {
        return this.productsService.findByCategory(+id);
    }
}
