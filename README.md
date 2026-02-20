# Frontend Mobile - Gestor de Actividades (MyFitness)

Aplicacion movil multiplataforma para gestionar actividades deportivas, reservas y perfil de usuario desde el telefono. Desarrollada con React Native y Expo, con interfaz oscura y detalles en naranja adaptada a la experiencia tactil.

---

## Tecnologias

| Componente        | Tecnologia                     |
| ----------------- | ------------------------------ |
| Framework         | React Native 0.81 + Expo 54   |
| Lenguaje          | TypeScript 5.9                 |
| Navegacion        | Expo Router 6 (file-based)     |
| Navegacion nativa | React Navigation 7             |
| Animaciones       | Reanimated 4                   |
| Linting           | ESLint (expo config)           |

---

## Ejecucion

### Requisitos previos

- Node.js (LTS)
- Expo CLI (`npx expo`)
- Backend activo y accesible desde el dispositivo

### Configuracion de red

Como la app movil no puede acceder a `localhost` del ordenador, hay que configurar la IP de la maquina que ejecuta el backend. Editar `constants/apiConfig.ts`:

```typescript
export const BACKEND_IP = '192.168.1.XXX';   // Tu IP local
export const BACKEND_PORT = '8080';
```

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

Pantallas centradas con titulo "My Fitness" en grande, inputs redondeados (pill-shaped) con fondo gris y boton naranja. Al hacer focus en un input aparece un borde izquierdo naranja.

- **Login:** Campos de username y password. Redireccion automatica segun rol tras login exitoso.
- **Signup:** Campos de username, password y confirmacion. Alerta nativa de exito y redireccion al login.

### Panel de usuario

El dashboard del usuario es un **menu de navegacion con tarjetas** (estilo hub) que da acceso a las tres secciones:

| Pantalla        | Que puede hacer el usuario                                                         |
| --------------- | ---------------------------------------------------------------------------------- |
| **Dashboard**   | Navegar a Perfil, Reservas o Actividades mediante tarjetas con iconos. Boton de logout en la parte inferior. |
| **Actividades** | Explorar actividades disponibles en una lista con scroll. Reservar con un toque en el icono de calendario. Las actividades con aforo completo se marcan con borde rojo, texto "FULL" e icono gris deshabilitado. Alerta nativa de exito al reservar. |
| **Reservas**    | Lista de reservas confirmadas con opcion de cancelar. Confirmacion con alerta nativa de dos opciones ("No" / "Yes, Cancel" en rojo). |
| **Perfil**      | Avatar grande con borde naranja, nombre, username y total de reservas. Cambio de contrasena desde un modal nativo con animacion slide-in. Spinner de carga dentro del boton durante la peticion. |

### Panel de administrador

El dashboard de admin tambien usa el formato hub con 3 tarjetas grandes en vertical:

| Pantalla        | Que puede hacer el admin                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| **Dashboard**   | Acceder a Usuarios, Actividades o Reservas mediante tarjetas con iconos grandes.   |
| **Actividades** | Crear, editar y eliminar actividades. Modal nativo para el formulario con campos de nombre, capacidad, descripcion, fecha y hora. Confirmacion destructiva antes de eliminar. |
| **Reservas**    | Ver todas las reservas del sistema. Cancelar cualquier reserva con confirmacion.    |
| **Usuarios**    | Lista de usuarios con rol USER. Eliminar con alerta de confirmacion destructiva.   |

---

## Diseno visual

| Elemento            | Detalle                                               |
| ------------------- | ----------------------------------------------------- |
| Tema                | Oscuro (#121212 / #222)                               |
| Color de acento     | Naranja calido (#F7B176)                              |
| Tarjetas            | Fondo semitransparente con bordes redondeados (20px)  |
| Iconos              | MaterialCommunityIcons                                |
| Focus en inputs     | Borde izquierdo naranja (controlado por state)        |
| Confirmaciones      | Alert nativo con opciones (estilo destructive en iOS)  |
| Mensajes de exito   | Alert nativo del sistema                              |
| Estados de carga    | ActivityIndicator (spinner nativo)                    |
| Modales             | Modal nativo de React Native (animacion slide)        |
| Listas              | FlatList con contentContainerStyle                    |

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

| Grupo      | Pantallas                                  | Rol     |
| ---------- | ------------------------------------------ | ------- |
| `(auth)`   | Login, Signup                              | Publico |
| `(user)`   | Dashboard, Actividades, Reservas, Perfil   | User    |
| `(admin)`  | Dashboard, Actividades, Reservas, Usuarios | Admin   |

---

## Diferencias con la version de escritorio

| Aspecto              | Desktop (Vue + Electron)            | Mobile (React Native + Expo)       |
| -------------------- | ----------------------------------- | ---------------------------------- |
| Plataforma           | Windows, Linux, macOS               | Android, iOS                       |
| Interfaz             | HTML/CSS en Chromium                | Componentes nativos                |
| Dashboard            | Datos en vivo (reservas+calendario) | Menu tipo hub con tarjetas         |
| Calendario           | Integrado en dashboard              | No disponible                      |
| Enrutamiento         | Vue Router (hash mode)              | Expo Router (file-based)           |
| Validacion           | Zod (schemas tipados)               | Validacion manual                  |
| Modales              | Div overlay con click-fuera         | Modal nativo con animacion slide   |
| Confirmaciones       | confirm() del navegador             | Alert nativo con estilo destructive|
| Mensajes de exito    | Toast inline (3s auto-dismiss)      | Alert nativo                       |
| Iconos               | Lucide Vue Next                     | MaterialCommunityIcons             |
| Carga                | Texto "Loading..." en botones       | ActivityIndicator (spinner)        |
| Conexion al backend  | localhost                           | IP de red local                    |
| Sesion               | ref reactivo + localStorage         | Objeto JS mutable (sin persistir)  |

---

## Sesion

La sesion se gestiona con un objeto JavaScript plano exportado que almacena `userId`, `username` y `role`. A diferencia del frontend desktop, no se persiste en almacenamiento local, por lo que se pierde al cerrar la app.
