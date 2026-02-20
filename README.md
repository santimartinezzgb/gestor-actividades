# Gestor de Actividades - MyFitness

Aplicacion para gestionar actividades deportivas, reservas y usuarios. Cuenta con dos roles: administrador y usuario. Permite crear y reservar actividades, gestionar usuarios y consultar el historial de reservas.

El proyecto esta dividido en tres partes:

```
gestor-actividades/
├── backend-gestor-actividades/           API REST (Spring Boot + MongoDB)
├── frontend-gestorActividades/           App de escritorio (Vue 3 + Electron)
└── frontend-mobile-gestorActividades/    App movil (React Native + Expo)
```

---

## Backend

API REST que gestiona usuarios, actividades y reservas. Incluye autenticacion HTTP Basic, control de acceso por roles y limpieza automatica de registros expirados.

**Tecnologias:** Java 21, Spring Boot 3.4.2, MongoDB Atlas, Spring Security, Maven

**Requisitos:**
- Java 21 o superior
- MongoDB Atlas con la variable de entorno `MONGODB_URI` configurada

**Arranque:**
```bash
cd backend-gestor-actividades
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080/api`.

---

## Frontend Desktop

Aplicacion de escritorio con interfaz web empaquetada como app nativa. Tema oscuro con detalles en naranja.

**Tecnologias:** Vue 3, TypeScript, Vite, Electron 30, Zod, Vue Router

**Requisitos:**
- Node.js 20.19+ o 22.12+
- Backend activo en `http://localhost:8080/api`

**Arranque:**
```bash
cd frontend-gestorActividades
npm install

# Modo navegador
npm run dev

# Modo escritorio
npm run electron
```

---

## Frontend Mobile

Aplicacion movil multiplataforma con interfaz adaptada a pantalla tactil. Mismo tema oscuro y naranja que el desktop.

**Tecnologias:** React Native 0.81, Expo 54, TypeScript, Expo Router

**Requisitos:**
- Node.js LTS
- Backend accesible desde el dispositivo (misma red local)

Antes de arrancar, configurar la IP del backend en `constants/apiConfig.ts`:
```typescript
export const BACKEND_IP = '192.168.1.XXX';  // IP de tu maquina
export const BACKEND_PORT = '8080';
```

**Arranque:**
```bash
cd frontend-mobile-gestorActividades
npm install
npx expo start
```

---

## Roles

| Rol   | Capacidades                                                              |
|-------|--------------------------------------------------------------------------|
| Admin | Crear/editar/eliminar actividades, ver todas las reservas, gestionar usuarios |
| User  | Explorar actividades, hacer y cancelar reservas, editar su perfil        |

---

## Repositorios individuales

Cada subcarpeta mantiene su propio historial de commits y tiene su repositorio original en GitHub:

- [backend-gestor-actividades](https://github.com/santimartinezzgb/backend-gestor-actividades)
- [frontend-gestorActividades](https://github.com/santimartinezzgb/frontend-gestorActividades)
- [frontend-mobile-gestorActividades](https://github.com/santimartinezzgb/frontend-mobile-gestorActividades)
