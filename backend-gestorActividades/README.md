# Backend - Gestor de Actividades (MyFitness)

API REST desarrollada con Spring Boot que gestiona usuarios, actividades deportivas y reservas. Proporciona autenticación, control de acceso por roles, validación de datos y limpieza automática de registros expirados.

---

## Tecnologias

- **Lenguaje:** Java 21
- **Framework:** Spring Boot 3.4.2
- **Base de datos:** MongoDB (Spring Data Mongo)
- **Seguridad:** Spring Security + BCrypt
- **Validacion:** Spring Validation (Jakarta)
- **Monitorizacion:** Spring Actuator
- **Build:** Maven (wrapper incluido)
- **Utilidades:** Lombok 1.18, Jackson JSR310

---

## Ejecución

### Requisitos previos

- Java 21 o superior
- MongoDB Atlas
- Variable de entorno `MONGODB_URI` configurada

### Arranque

Configurar las variables de entorno en tu IDE. Las necesarias están disponibles en el archivo .env.example

```bash
./mvnw spring-boot:run
```
---

## Modelo de datos (MongoDB Atlas)

### User

- `id` (String) — ObjectId generado por Mongo
- `name` (String)
- `surname` (String)
- `username` (String) — Unico (validado en servicio)
- `password` (String) — Hash BCrypt
- `rol` (Role enum) — ROLE_USER / ROLE_ADMIN
- `createdAt` (LocalDateTime) — Asignado automaticamente
- `isActive` (boolean) — Default true (para soft delete)

### Activity

- `id` (String) — ObjectId
- `name` (String)
- `description` (String)
- `dateTime` (LocalDateTime) — Debe ser >= 24h en el futuro
- `maxCapacity` (int) — Aforo maximo
- `numUsers` (int) — Plazas ocupadas (default 0)
- `isActive` (boolean) — Default true

### Reserve

- `id` (String) — ObjectId
- `user` (User) — Referencia (DBRef, lazy)
- `activity` (Activity) — Referencia (DBRef, lazy)
- `reservedAt` (LocalDateTime) — Fecha de creacion
- `state` (ReserveState) — CONFIRMED / CANCELLED

---

## Endpoints

### Autenticación — `/api/auth`

- **POST `/login`** — Body: LoginRequestDTO → Respuesta: AuthResponseDTO
- **POST `/signup`** — Body: User → Respuesta: User

### Actividades — `/api/activities`

- **GET `/`** — Listar todas (filtra expiradas >24h)
- **POST `/`** — Crear (valida nombre, fecha >= 24h futuro)
- **PUT `/{id}`** — Actualizar (revalida fecha si cambio)
- **DELETE `/{id}`** — Eliminar

### Reservas — `/api/reserves`

- **GET `/`** — Listar todas
- **GET `/{id}`** — Obtener por ID
- **POST `/`** — Crear (3 validaciones, ver abajo)
- **PUT `/{id}`** — Actualizar (transfiere contadores)
- **PATCH `/{id}`** — Cancelar (libera plaza si > 15 min)
- **DELETE `/{id}`** — Eliminar (libera plaza y borra)

### Usuarios — `/api/users`

- **GET `/`** — Listar todos (filtro por rol)
- **GET `/{id}`** — Obtener por ID
- **GET `/username/{username}`** — Obtener por username
- **POST `/`** — Crear (valida duplicados, BCrypt)
- **PUT `/{id}`** — Actualizar
- **PATCH `/{id}`** — Desactivar (soft delete)
- **DELETE `/{id}`** — Eliminar definitivo
- **PUT `/{id}/password`** — Cambiar contrasena

---

## Reglas de negocio

### Reservas — 3 validaciones al crear

1. **Timing:** la reserva debe hacerse al menos 15 minutos antes del inicio de la actividad.
2. **Duplicados:** no se permiten dos reservas CONFIRMED del mismo usuario para la misma actividad.
3. **Capacidad:** `numUsers` no puede superar `maxCapacity`.

### Cancelación de reservas

- Solo se puede cancelar si faltan mas de 15 minutos para el inicio.
- Al cancelar se libera una plaza (`numUsers--`).

### Usuarios

- El username debe ser único (lanza `DuplicateUserException` si ya existe).
- La contraseña se hashea con BCrypt.
- Rol por defecto: `ROLE_USER`.
- Cambio de contraseña: verifica la actual con `BCrypt.matches()` y válida longitud >= 6.

### Actividades

- La fecha debe ser al menos 24 horas en el futuro al crear.
- Al actualizar, la fecha solo se revalida si cambio respecto a la original.

---

## Seguridad

- **Autenticacion:** HTTP Basic con DaoAuthenticationProvider
- **Sesiones:** Stateless (sin cookies de sesion)
- **Hash de contrasenas:** BCrypt
- **Proteccion de contrasenas:** El UserDTO no expone el campo password en respuestas

---

## Manejo de errores

Centralizado en `GlobalExceptionHandler` con respuestas uniformes (`ErrorResponseDTO`)

---

## Tareas programadas

**CleanupScheduler** se ejecuta cada hora (`@Scheduled(fixedRate = 3600000)`):

1. Busca actividades con `isActive = false`.
2. Elimina las reservas asociadas.
3. Elimina las actividades.
4. Log con SLF4J de los registros eliminados.

Además, `ActivityService.getAll()` filtra en memoria las actividades expiradas hace más de 24h como doble protección.

---



