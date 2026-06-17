import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;

  constructor(items: T[], meta: PaginationMeta) {
    this.items = items;
    this.total = meta.total;
    this.page = meta.page;
    this.limit = meta.limit;
  }
}

export class PaginationParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}
