import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CategoryEntity } from "../categories/category.types";
import { IsString, MinLength, MaxLength, IsNumber, IsPositive, IsInt, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";


@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('real')
  price!: number;

  @Column('int', { default: 0 })
  stock!: number;

  @Column('int')
  categoryId!: number;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

export class CreateProductInput {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock!: number;

  @IsInt()
  @Type(() => Number)
  categoryId!: number;
}

export class UpdateProductInput {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  categoryId?: number;
}

export class ReduceStockInput {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}
