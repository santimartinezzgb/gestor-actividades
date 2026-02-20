# Frontend Desktop - Gestor de Actividades (MyFitness)

Aplicacion de escritorio para gestionar actividades deportivas, reservas y usuarios. Construida con Vue 3 y empaquetada como app nativa con Electron. Interfaz moderna con tema oscuro y detalles en naranja.

---

## Tecnologias

| Componente      | Tecnologia               |
| --------------- | ------------------------ |
| Framework       | Vue 3 (Composition API)  |
| Lenguaje        | TypeScript               |
| Bundler         | Vite 7                   |
| Escritorio      | Electron 30              |
| Validacion      | Zod 4                    |
| Iconos          | Lucide Vue Next          |
| Enrutamiento    | Vue Router 4 (Hash mode) |

---

## Ejecucion

### Requisitos previos

- Node.js 20.19+ o 22.12+
- Backend activo en `http://localhost:8080/api`

### Modo desarrollo (navegador)

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`.

### Modo escritorio (Electron)

```bash
npm run electron
```

O con los scripts incluidos:

```bash
# Linux
./scripts/start-linux.sh

# Windows
scripts\start-windows.bat
```

La ventana de Electron arranca maximizada con acceso completo al frontend.

---

## Pantallas de la aplicacion

### Autenticacion

**Login** y **Signup** comparten un layout a dos columnas: a la izquierda el branding "MyFitness" con tipografia grande, a la derecha el formulario con pestanas Login / Sign Up y un indicador de pestana activa en naranja.

- Validacion de formularios con **Zod** (errores inline por campo).
- Indicador de carga en el boton durante la peticion.
- Mensajes de error del servidor en caja roja.
- Registro exitoso: mensaje verde con redireccion automatica al login en 2 segundos.
- Tras login, redireccion automatica segun rol (admin o user).

### Panel de usuario

| Pantalla        | Que puede hacer el usuario                                                              |
| --------------- | --------------------------------------------------------------------------------------- |
| **Dashboard**   | Ver sus reservas en una lista lateral y un calendario mensual que marca los dias con reservas. Cancelar reservas directamente. Navegar a actividades con un boton "+ New". |
| **Actividades** | Explorar actividades disponibles y reservar con un click. El boton cambia de estado: "Reserve" (naranja), "Reserved" (verde, ya reservada) o "Full" (gris, aforo completo). Las actividades llenas se destacan con fondo rojo. Toast de exito verde al reservar. |
| **Reservas**    | Ver todas sus reservas confirmadas. Cancelar con confirmacion previa.                   |
| **Perfil**      | Ver avatar, nombre, username y total de reservas. Cambiar contrasena desde un modal con verificacion de contrasena actual. |

### Panel de administrador

| Pantalla        | Que puede hacer el admin                                                                |
| --------------- | --------------------------------------------------------------------------------------- |
| **Dashboard**   | Vista general con 3 paneles resumen (usuarios, actividades y reservas) cada uno con badge contador y acceso rapido a la gestion. Calendario mensual que marca dias con actividades. Las actividades con aforo completo se muestran en rojo. |
| **Actividades** | Crear, editar y eliminar actividades desde un modal con campos de nombre, capacidad, descripcion, fecha y hora. Confirmacion antes de eliminar. |
| **Reservas**    | Ver todas las reservas del sistema (no solo las propias). Cancelar cualquier reserva.   |
| **Usuarios**    | Lista de usuarios con rol USER. Eliminar usuarios con confirmacion.                     |

---

## Estructura del proyecto

```
frontend-gestorActividades/
  package.json
  vite.config.js
  electron-main.js                -- Proceso principal de Electron
  index.html
  scripts/
    start-linux.sh
    start-windows.bat
  src/
    main.ts                       -- Punto de entrada Vue
    App.vue                       -- Componente raiz (solo RouterView)
    assets/
      base.css                    -- Variables y reset
      main.css                    -- Estilos globales
    router/
      index.js                    -- Definicion de rutas
    services/
      auth/
        authService.ts            -- Login y registro
        session.ts                -- Estado reactivo de sesion (ref)
      activity/
        activityService.ts        -- CRUD de actividades
      reserve/
        reserveService.ts         -- CRUD de reservas
      user/
        userService.ts            -- CRUD de usuarios
    views/
      auth/
        LoginView.vue             -- Login con Zod
        SignupView.vue            -- Registro con Zod
      user/
        DashboardView.vue         -- Reservas + calendario
        ActivitiesView.vue        -- Explorar y reservar
        ReservesView.vue          -- Mis reservas
        ProfileView.vue           -- Perfil + cambio de contrasena
      admin/
        DashboardView.vue         -- Paneles resumen + calendario
        ActivitiesView.vue        -- CRUD actividades
        ReservesView.vue          -- Gestion de reservas
        UsersView.vue             -- Gestion de usuarios
    components/                   -- Componentes reutilizables
```

---

## Rutas

| Ruta                | Vista                | Rol     |
| ------------------- | -------------------- | ------- |
| `/login`            | Login                | Publico |
| `/signup`           | Registro             | Publico |
| `/user`             | Dashboard usuario    | User    |
| `/user/activities`  | Actividades          | User    |
| `/user/reserves`    | Reservas             | User    |
| `/user/profile`     | Perfil               | User    |
| `/admin`            | Dashboard admin      | Admin   |
| `/admin/activities` | Gestion actividades  | Admin   |
| `/admin/reserves`   | Gestion reservas     | Admin   |
| `/admin/users`      | Gestion usuarios     | Admin   |

---

## Sesion

La sesion se gestiona con un `ref` reactivo de Vue que almacena `userId`, `username` y `role`. Ademas, se persiste el token en `localStorage` para mantener la autenticacion entre recargas. Si no hay sesion activa, la app redirige al login.
