import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CATEGORIES_REPOSITORY, TypeOrmCategoriesRepository } from './categories.repository';
import { CategoryEntity } from './category.types';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        {
            provide: CATEGORIES_REPOSITORY,
            useClass: TypeOrmCategoriesRepository,
        },
    ],
    exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule { }
