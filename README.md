# BACKEND - Gestor de Actividades - Documentación Técnica

## Introducción
Proyecto backend para una aplicación de gestión de actividades, construido con Spring Boot 3.4.2 y Java 21. Proporciona registro/gestión de usuarios y gestión de actividades y reservas almacenadas en MongoDB.

## Resumen rápido
- Framework: Spring Boot 3.4.2
- Lenguaje: Java 21
- Base de datos: MongoDB (driver Spring Data MongoDB)
- Seguridad: Spring Security (autenticación por usuarios almacenados en la base de datos). Eliminado uso de JWT para simplificar.
- Constructor: Maven

## Estructura / Arquitectura
- `com.backend.gestorActividades` - raíz del paquete
  - `controllers` - Controladores REST (AuthController, UserController, ActivityController, ReserveController)
  - `services` - Lógica de negocio (AuthService, UserService, ActivityService, ReserveService)
  - `repositories` - Repositorios Spring Data (UserRepository, ActivityRepository, ReserveRepository)
  - `models` - Entidades (User, Activity, Reserve) y enums
  - `security` - Configuración de seguridad (UserDetailsServiceImpl y `SecurityConfig`)
  - `config` - Configuraciones varias; contiene `MongoServices/UserDetailsServiceImpl` (implementación de UserDetailsService basada en Mongo)

La aplicación sigue el patrón clásico MVC + servicios con repositorios que usan Spring Data.

## Flujo de autenticación (actualizado)
1. El usuario hace login a través de `/api/auth/login` (controlador de autenticación).
2. `AuthService` valida credenciales y devuelve información básica del usuario (username y rol). No se generan ni se validan tokens JWT.
3. La protección de endpoints está controlada por `SecurityConfig` y `UserDetailsServiceImpl`.

## Endpoints principales (resumen)
- `/api/auth/**` - endpoints de autenticación (login, register) — permitidos sin token.
- Resto de endpoints: requieren autenticación de Spring Security (configurada en `SecurityConfig`).

Para detalles exactos de parámetros y modelos consultar los controladores en `src/main/java/com/backend/gestorActividades/controllers`.
