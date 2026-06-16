import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_categories",
    description: "Obtiene una lista paginada de categorías.",
    inputSchema: {
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().optional(),
    },
    handler: async (params: any) => {
      return api.get("/categories", { params });
    },
  },
  {
    name: "get_category",
    description: "Obtiene los detalles de una categoría por su ID numérico.",
    inputSchema: {
      id: z.number().int().positive(),
    },
    handler: async ({ id }: any) => {
      return api.get(`/categories/${id}`);
    },
  },
  {
    name: "create_category",
    description: "Crea una nueva categoría. Requiere estar autenticado como Admin.",
    inputSchema: {
      name: z.string().min(1),
    },
    handler: async (body: any) => {
      return api.post("/categories", body);
    },
  },
  {
    name: "update_category",
    description: "Actualiza el nombre de una categoría existente. Requiere estar autenticado como Admin.",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(1),
    },
    handler: async ({ id, ...body }: any) => {
      return api.put(`/categories/${id}`, body);
    },
  },
  {
    name: "delete_category",
    description: "Elimina una categoría por su ID. Requiere estar autenticado como Admin.",
    inputSchema: {
      id: z.number().int().positive(),
    },
    handler: async ({ id }: any) => {
      return api.del(`/categories/${id}`);
    },
  },
] as ToolDef[];
