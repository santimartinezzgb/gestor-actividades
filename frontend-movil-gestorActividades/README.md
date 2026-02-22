# Frontend Mobile - Gestor de Actividades (MyFitness)

Aplicacion movil multiplataforma para gestionar actividades deportivas, reservas y perfil de usuario desde el telefono. Desarrollada con React Native y Expo, con interfaz oscura y detalles en naranja adaptada a la experiencia tactil.

---

## Tecnologias

- **Framework:** React Native 0.81 + Expo 54
- **Lenguaje:** TypeScript 5.9
- **Navegacion:** Expo Router 6 (file-based)
- **Navegacion nativa:** React Navigation 7
- **Animaciones:** Reanimated 4
- **Linting:** ESLint (expo config)

---

## Ejecucion

### Requisitos previos

- Node.js (LTS)
- Expo CLI (`npx expo`)
- Backend activo y accesible desde el dispositivo

### Configuracion de red

Como la app movil no puede acceder a `localhost` del ordenador, hay que configurar la IP de la maquina que ejecuta el backend. Editar `constants/apiConfig.ts`.

### Arranque

```bash
npm install
npx expo start
```

Desde ahi puedes abrir la app en:

- `npm run android` -- Emulador o dispositivo Android conectado
- `npm run ios` -- Simulador iOS (solo macOS)
- `npm run web` -- Navegador (modo web)

---

## Pantallas de la aplicacion

### Autenticacion

- **Login:** Campos de username y password. Redireccion automatica segun rol tras login exitoso.
- **Signup:** Campos de username, password y confirmacion. Alerta nativa de exito y redireccion al login.

### Panel de usuario

El dashboard del usuario es un **menu de navegacion con tarjetas** que da acceso a las tres secciones:

- **Dashboard:**
- **Actividades:**
- **Reservas:**
- **Perfil:**
- **Calendario**

### Panel de administrador

El dashboard de admin usa el formato con 3 tarjetas grandes en vertical:

- **Dashboard:**
- **Actividades:**
- **Reservas:**
- **Usuarios:**
- **Calendario**

---

## Estructura del proyecto

```
frontend-mobile-gestorActividades/
  package.json
  app.json                         -- Configuracion de Expo
  tsconfig.json
  constants/
    apiConfig.ts                   -- IP y puerto del backend
  services/
    authService.ts                 -- Login y registro
    session.ts                     -- Objeto de sesion (mutable)
    activityService.ts             -- CRUD de actividades
    reserveService.ts              -- CRUD de reservas
    userService.ts                 -- CRUD de usuarios
  app/                             -- Rutas (file-based routing)
    index.tsx                      -- Redirige a /login
    (auth)/
      login.tsx
      signup.tsx
    (user)/
      user.tsx                     -- Layout de usuario
      user/
        activities.tsx
        reserves.tsx
        profile.tsx
    (admin)/
      admin.tsx                    -- Layout de administrador
      admin/
        activities.tsx
        reserves.tsx
        users.tsx
  components/                      -- Logica y UI de cada seccion
    auth/
      Login.tsx
      Signup.tsx
    user/
      User.tsx                     -- Dashboard (hub)
      ActivitiesUser.tsx
      ReservesUser.tsx
      Profile.tsx
    admin/
      AdminDashboard.tsx           -- Dashboard admin (hub)
      ActivitiesAdmin.tsx
      ReservesAdmin.tsx
      UsersAdmin.tsx
```

---

## Navegacion

La app usa **Expo Router** con enrutamiento basado en archivos. Los grupos de rutas se definen con parentesis y no aparecen en la URL:

- **`(auth)`** — Login, Signup (Publico)
- **`(user)`** — Dashboard, Actividades, Reservas, Perfil (User)
- **`(admin)`** — Dashboard, Actividades, Reservas, Usuarios (Admin)

---

