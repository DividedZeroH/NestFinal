# API NestJS

## Configuracion

1. Ejecutar `npm install`.
2. Copiar `.env.example` a `.env`.
3. Definir `JWT_SECRET` con un valor largo y privado.
4. Ejecutar `npm run build` para verificar compilacion.
5. Ejecutar `npm run start:dev` para levantar la API.

Variables requeridas:

```env
BCRYPT_COST=12
SQLITE_DATABASE=./db/products.db
JWT_SECRET=cambia_esto_por_algo_largo_aleatorio
JWT_EXPIRES_SEC=3600
```

## Rutas principales

- `POST /auth/register`: registra usuario. El primer usuario creado es `admin`; los siguientes son `user`.
- `POST /auth/login`: devuelve `{ "access_token": "..." }`.
- `GET /placeholder-users`: ruta publica de usuarios externos.
- `GET /users`: requiere Bearer token de admin.
- `PATCH /users/:id/role`: requiere Bearer token de admin y body `{ "role": "admin" }` o `{ "role": "user" }`.

## Prueba rapida

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"bootstrap@demo.com","password":"Clave_demo_larga_123"}'

curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"bootstrap@demo.com","password":"Clave_demo_larga_123"}'

curl -si http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```
