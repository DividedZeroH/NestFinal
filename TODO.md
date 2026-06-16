# Guía de Tareas Pendientes - Práctico Final

Este documento contiene el análisis del estado actual del proyecto y la lista detallada de tareas necesarias para completar el **Práctico Final** (tanto para **Aprobar** como para **Promocionar**).

> [!IMPORTANT]
> **Estado del Backend (`/back`):**
> La carpeta `back` se encuentra actualmente **vacía**. Para poder iniciar el desarrollo, debes copiar el código base del backend (NestJS + PostgreSQL) provisto por la cátedra dentro del directorio `/back`.

---

## 📋 Resumen del Proyecto y Estructura
1. **/front (Angular 17+):** Aplicación frontend con componentes standalone y Bootstrap 5 para el diseño.
2. **/back (NestJS + PostgreSQL):** Servidor backend REST API (debe colocarse en la carpeta `back`).
3. **/mcp (TypeScript):** Servidor Model Context Protocol (MCP) que sirve como puente entre OpenCode (o Claude Desktop) y la API del backend.
4. **/docs:** Documentación en PDF con las especificaciones del práctico.

---

## 🛠️ Nivel 1: Condiciones para Aprobar (Autenticación Avanzada)

### 1.1 Verificación de Email - Backend
- [ ] **Modificar `UserEntity`:**
  - Agregar columna `isVerified` (booleano, default `false`).
  - Agregar columna `verificationToken` (string, nullable).
- [ ] **Modificar `POST /auth/register`:**
  - Generar un token único con `crypto.randomUUID()` al registrar un usuario.
  - Guardar el token en la base de datos para el usuario creado.
  - Enviar un correo electrónico utilizando un servicio real (Resend, SendGrid o SMTP configurado en `back/.env`). El enlace debe apuntar a: `http://localhost:4200/verify-email?token=<token>`.
  - **Importante:** No devolver el token en la respuesta HTTP.
- [ ] **Crear `POST /auth/verify-email` (sin JWT auth):**
  - Recibir `{ token }` en el body.
  - Buscar usuario por token, marcar `isVerified = true` y limpiar `verificationToken`.
  - Responder con `{ message: "Email verificado" }` o error HTTP 400 `{ "message": "Token inválido o expirado" }`.
- [ ] **Crear `POST /auth/resend-verification` (con JWT auth):**
  - Generar un nuevo token, guardarlo y reenviar el email de verificación.
- [ ] **Modificar `GET /auth/me`:**
  - Incluir el campo `isVerified` en la respuesta.

### 1.2 Verificación de Email - Frontend (Angular)
- [ ] **Crear la página `/verify-pending` (sin auth guard):**
  - Mostrar el mensaje indicando que se envió el correo.
  - Añadir botón de "Reenviar email" que llame a `resend-verification`.
- [ ] **Crear la página `/verify-email?token=xxx` (sin auth guard):**
  - Capturar el token de la URL, llamar a `verify-email` en el backend.
  - Mostrar mensaje de éxito y un enlace para iniciar sesión.
  - Manejar el caso de token inválido mostrando un mensaje de error y un enlace para reenviar (redirigiendo a login/registro si es necesario).
- [ ] **Modificar Registro:**
  - Redirigir automáticamente a `/verify-pending` después de un registro exitoso.
- [ ] **Modificar Perfil (`profile.html`):**
  - Mostrar badge de "Verificado" o "No verificado".
  - Si no está verificado, mostrar botón para "Reenviar email".

### 1.3 Recuperación de Contraseña - Backend
- [ ] **Modificar `UserEntity`:**
  - Agregar `resetPasswordToken` (string, nullable).
  - Agregar `resetPasswordExpires` (datetime, nullable).
- [ ] **Crear `POST /auth/forgot-password` (sin JWT auth):**
  - Recibir `{ email }`.
  - Si el usuario existe, generar un token único y una fecha de expiración (ej. 1 hora).
  - Enviar correo con enlace: `http://localhost:4200/reset-password?token=<token>`.
  - Responder siempre con `{ message: "Si el email existe, recibirás un link" }` por seguridad.
- [ ] **Crear `POST /auth/reset-password` (sin JWT auth):**
  - Recibir `{ token, password }`.
  - Validar que el token exista y no haya expirado.
  - Hashear la nueva contraseña, actualizarla en el usuario y borrar los campos de recuperación.
  - Responder con `{ message: "Contraseña actualizada" }` o error HTTP 400.

### 1.4 Recuperación de Contraseña - Frontend (Angular)
- [ ] **Crear la página `/forgot-password` (sin auth guard):**
  - Formulario para ingresar el email y botón "Enviar link".
- [ ] **Crear la página `/reset-password?token=xxx` (sin auth guard):**
  - Formulario con campos "Nueva contraseña" y "Confirmar contraseña" (mínimo 8 caracteres).
  - Validar que coincidan, enviar la petición a `/reset-password` en el backend y mostrar mensaje de éxito.
- [ ] **Modificar Login:**
  - Añadir enlace "¿Olvidaste tu contraseña?" que redirija a `/forgot-password`.

### 1.5 Toast / Notificaciones globales
- [ ] **Crear `services/toast.service.ts` y el componente `shared/toast/`:**
  - Reemplazar las alertas locales `{{ error }}` por notificaciones Toast autodescartables para:
    - Éxitos (ej. "Contraseña actualizada", "Email verificado").
    - Errores (ej. "Token inválido o expirado", "Credenciales inválidas").

### 1.6 Cambio de Contraseña y Email desde el Perfil
- [ ] **Modificar la página de Perfil:**
  - Formulario de **Cambiar Contraseña**: requiere contraseña actual, nueva contraseña y confirmar nueva contraseña. Llama a `PATCH /users/me/password`.
  - Formulario de **Cambiar Email**: requiere nuevo email y contraseña actual. Llama a `PATCH /users/me/email`.

---

## 🚀 Nivel 2: Condiciones para Promocionar (Servidor MCP)

El objetivo es exponer toda la funcionalidad CRUD de la API en el servidor MCP para que la IA (en OpenCode o Claude Desktop) pueda interactuar con la base de datos.

### 2.1 Herramientas de Productos (`mcp/src/tools/products.ts`)
- [ ] Implementar la herramienta `list_products` (`GET /products` con filtros y paginación).
- [ ] Implementar la herramienta `get_product` (`GET /products/:id`).
- [ ] Implementar la herramienta `create_product` (`POST /products`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `update_product` (`PUT /products/:id`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `delete_product` (`DELETE /products/:id`, requiere JWT + rol Admin).

### 2.2 Herramientas de Categorías (`mcp/src/tools/categories.ts`)
- [ ] Implementar la herramienta `list_categories` (`GET /categories`).
- [ ] Implementar la herramienta `get_category` (`GET /categories/:id`).
- [ ] Implementar la herramienta `create_category` (`POST /categories`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `update_category` (`PUT /categories/:id`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `delete_category` (`DELETE /categories/:id`, requiere JWT + rol Admin).

### 2.3 Herramientas de Usuarios (`mcp/src/tools/users.ts`)
- [ ] Implementar la herramienta `list_users` (`GET /users`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `update_user_role` (`PATCH /users/:id/role`, requiere JWT + rol Admin).
- [ ] Implementar la herramienta `update_my_password` (`PATCH /users/me/password`, requiere JWT).
- [ ] Implementar la herramienta `update_my_email` (`PATCH /users/me/email`, requiere JWT).

### 2.4 Actualizar el índice del Servidor MCP
- [ ] Importar y registrar todas las nuevas herramientas en `mcp/src/tools/index.ts`.

---

## 🏃 Cómo arrancar y probar

### Backend
1. Colocar el código base en `/back`.
2. Crear un archivo `.env` en `/back` con las credenciales de base de datos y de email (Resend/SMTP).
3. Instalar dependencias e iniciar:
   ```bash
   cd back
   npm install
   npm run start:dev
   ```

### Frontend
1. Instalar dependencias e iniciar:
   ```bash
   cd front
   npm install
   npm start
   ```

### MCP
1. Instalar dependencias:
   ```bash
   cd mcp
   npm install
   npm install zod
   ```
2. Ejecutar para probar localmente con OpenCode:
   ```bash
   npx tsx mcp/src/index.ts
   ```
