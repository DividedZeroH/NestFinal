import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description: "Obtiene una lista paginada de productos con filtros de búsqueda por nombre y ordenación.",
    inputSchema: {
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().optional(),
      name: z.string().optional(),
      sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
      order: z.enum(["ASC", "DESC"]).optional(),
    },
    handler: async (params: any) => {
      return api.get("/products", { params });
    },
  },
  {
    name: "get_product",
    description: "Obtiene los detalles de un producto por su ID numérico.",
    inputSchema: {
      id: z.number().int().positive(),
    },
    handler: async ({ id }: any) => {
      return api.get(`/products/${id}`);
    },
  },
  {
    name: "create_product",
    description: "Crea un nuevo producto en el catálogo. Requiere estar autenticado como Admin.",
    inputSchema: {
      name: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().int().nonnegative().optional(),
      categoryId: z.number().int().positive().nullable().optional(),
    },
    handler: async (body: any) => {
      return api.post("/products", body);
    },
  },
  {
    name: "update_product",
    description: "Actualiza los campos de un producto existente. Requiere estar autenticado como Admin.",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().nonnegative().optional(),
      categoryId: z.number().int().positive().nullable().optional(),
    },
    handler: async ({ id, ...body }: any) => {
      return api.put(`/products/${id}`, body);
    },
  },
  {
    name: "delete_product",
    description: "Elimina un producto del catálogo por su ID. Requiere estar autenticado como Admin.",
    inputSchema: {
      id: z.number().int().positive(),
    },
    handler: async ({ id }: any) => {
      return api.del(`/products/${id}`);
    },
  },
] as ToolDef[];
