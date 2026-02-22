# Frontend Desktop - Gestor de Actividades (MyFitness)

Aplicacion de escritorio para gestionar actividades deportivas, reservas y usuarios. Construida con Vue 3 y empaquetada como app nativa con Electron. Interfaz moderna con tema oscuro y detalles en naranja.

---

## Tecnologias

- **Framework:** Vue 3 (Composition API)
- **Lenguaje:** TypeScript
- **Bundler:** Vite 7
- **Escritorio:** Electron 30
- **Validacion:** Zod 4
- **Iconos:** Lucide Vue Next
- **Enrutamiento:** Vue Router 4 (Hash mode)

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

**Login** y **Signup**

- Validacion de formularios con **Zod**
- Indicador de carga en el boton durante la peticion.
- Mensajes de error del servidor en la UI para cada tipo de error.
- Registro exitoso: mensaje verde con redireccion automatica al login en 2 segundos.
- Tras login, redireccion automatica segun rol (admin o user).

### Panel de usuario

- **Dashboard:**
- **Actividades:**
- **Reservas:**
- **Perfil:**
- **Calendario**

### Panel de administrador

- **Dashboard:**
- **Actividades:**
- **Reservas:**
- **Usuarios:**
- **Calendario**

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

- `/login` — Login (Publico)
- `/signup` — Registro (Publico)
- `/user` — Dashboard usuario (User)
- `/user/activities` — Actividades (User)
- `/user/reserves` — Reservas (User)
- `/user/profile` — Perfil (User)
- `/admin` — Dashboard admin (Admin)
- `/admin/activities` — Gestion actividades (Admin)
- `/admin/reserves` — Gestion reservas (Admin)
- `/admin/users` — Gestion usuarios (Admin)

---
