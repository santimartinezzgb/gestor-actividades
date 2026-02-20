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

## Roles

| Rol   | Capacidades                                                              |
|-------|--------------------------------------------------------------------------|
| Admin | Crear/editar/eliminar actividades, ver todas las reservas, gestionar usuarios |
| User  | Explorar actividades, hacer y cancelar reservas, editar su perfil        |

---
