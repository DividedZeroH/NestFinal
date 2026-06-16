import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Obtiene la lista de todos los usuarios registrados. Requiere estar autenticado como Admin.",
    handler: async () => {
      return api.get("/users");
    },
  },
  {
    name: "update_user_role",
    description: "Actualiza el rol de un usuario. Requiere estar autenticado como Admin.",
    inputSchema: {
      id: z.string().uuid(),
      role: z.enum(["user", "admin"]),
    },
    handler: async ({ id, role }: any) => {
      return api.patch(`/users/${id}/role`, { role });
    },
  },
  {
    name: "update_my_password",
    description: "Cambia la contraseña del usuario actualmente autenticado.",
    inputSchema: {
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    },
    handler: async (body: any) => {
      return api.patch("/users/me/password", body);
    },
  },
  {
    name: "update_my_email",
    description: "Cambia el correo electrónico del usuario actualmente autenticado. Se le enviará un correo de verificación a la nueva dirección.",
    inputSchema: {
      newEmail: z.string().email(),
      currentPassword: z.string(),
    },
    handler: async (body: any) => {
      return api.patch("/users/me/email", body);
    },
  },
] as ToolDef[];
