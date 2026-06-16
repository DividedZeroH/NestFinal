# Práctico Final

Aplicación full-stack: **Angular** (frontend) + **NestJS** (backend) + servidor **MCP**.

---

## Estructura

```
practico-final/
├── back/api-c/   # Backend NestJS + SQLite
├── front/        # Frontend Angular 17+
├── mcp/          # Servidor MCP (Model Context Protocol)
└── docs/         # PDFs con la especificación del práctico
```

---

## Requisitos

- Node.js 18+
- Cuenta en [Resend](https://resend.com) (o servidor SMTP) para el envío de emails

---

## Configuración

### Backend — `back/api-c/.env`

Crear el archivo `.env` en `back/api-c/` con las siguientes variables:

```env
# JWT
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_COST=12

# Email — opción 1: Resend (recomendado)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Email — opción 2: SMTP
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=587
# SMTP_USER=tu_usuario
# SMTP_PASS=tu_contraseña
# SMTP_FROM=noreply@tudominio.com
```

> El `.env` **no se sube al repositorio**.

---

## Cómo correr el proyecto

### Backend

```bash
cd back/api-c
npm install
npm run start:dev
```

Corre en `http://localhost:3000`.

### Frontend

```bash
cd front
npm install
npm start
```

Corre en `http://localhost:4200`.

### Servidor MCP (solo para promocionar)

```bash
cd mcp
npm install
npm install zod
npx tsx src/index.ts
```

---

## Funcionalidades implementadas

### Para aprobar

- Verificación de email al registrarse (token único, link por email real)
- Reenvío del email de verificación
- Recuperación de contraseña por email (token con expiración de 1 hora)
- Toast notifications en todos los flujos
- Cambio de contraseña desde el perfil
- Cambio de email desde el perfil

### Para promocionar

Servidor MCP que expone la API como herramientas invocables desde OpenCode/Claude Desktop:

| Herramienta | Endpoint |
|---|---|
| `list_products` | GET /products |
| `get_product` | GET /products/:id |
| `create_product` | POST /products |
| `update_product` | PUT /products/:id |
| `delete_product` | DELETE /products/:id |
| `list_categories` | GET /categories |
| `get_category` | GET /categories/:id |
| `create_category` | POST /categories |
| `update_category` | PUT /categories/:id |
| `delete_category` | DELETE /categories/:id |
| `list_users` | GET /users |
| `update_user_role` | PATCH /users/:id/role |
| `update_my_password` | PATCH /users/me/password |
| `update_my_email` | PATCH /users/me/email |

---

## API — Endpoints principales

| Método | Ruta | Auth |
|---|---|---|
| POST | /auth/register | No |
| POST | /auth/login | No |
| GET | /auth/me | JWT |
| POST | /auth/verify-email | No |
| POST | /auth/resend-verification | JWT |
| POST | /auth/forgot-password | No |
| POST | /auth/reset-password | No |
| PATCH | /users/me/password | JWT |
| PATCH | /users/me/email | JWT |
| GET | /products | JWT |
| GET | /categories | JWT |
