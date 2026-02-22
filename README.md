# Gestor de Actividades - MyFitness

Aplicacion de gestión básica de actividades, reservas y usuarios.

El proyecto esta dividido en tres partes:

- Backend → Spring Boot + Mongo Atlas
- Frontend Escritorio → Vue + Electron
- Frontend Móvil → React Native + Expo

## Roles

### Usuario
- Registrarse e iniciar sesión
- Explorar las actividades disponibles
- Realizar y cancelar reservas
- Consultar su historial de reservas
- Editar su contraseña

### Administrador
- Crear, editar y eliminar actividades
- Consultar todas las reservas del sistema
- Cunsultar los usuarios

## Características destacadas

- **Autenticación con JWT** → Sistema de login seguro con tokens, refresh tokens y expiración de sesión
- **Separación de validaciones en backend** → Validaciones de negocio separadas de las validaciones de entrada de datos
- **Roles y permisos** → Control de acceso basado en roles
- **Multiplataforma** → Una misma API sirve tanto al cliente de escritorio como al móvil
- **Sincronización en tiempo real** → Las reservas se actualizan de forma reactiva en la interfaz
- **Base de datos en la nube** → Uso de MongoDB Atlas para persistencia de datos sin necesidad de infraestructura local


## Diagramas de ejemplo de casos de uso de la app
![Diagrama](Diagrama.png)

---

### Para más información, entra en cada repositorio