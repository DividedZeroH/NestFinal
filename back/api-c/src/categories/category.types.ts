import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsString, MinLength, MaxLength } from "class-validator";

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}

export interface Category {
    id: number;
    name: string;
}

export class CreateCategoryInput {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;
}

export class UpdateCategoryInput {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;
}
