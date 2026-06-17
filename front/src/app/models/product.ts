export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number | null;
  category: { id: number; name: string } | null;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock?: number;
  categoryId?: number | null;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  categoryId?: number | null;
}

export interface QueryProductsDto {
  name?: string;
  sortBy?: 'id' | 'name' | 'price' | 'stock';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
