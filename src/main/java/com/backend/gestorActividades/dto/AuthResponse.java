package com.backend.gestorActividades.dto;

/**
 * DTO para la respuesta de autenticación, que incluye el token JWT, el nombre de usuario y el rol del usuario.
 *
 * @param username El nombre de usuario del usuario autenticado.
 * @param role     El rol del usuario autenticado (por ejemplo, ADMIN o USER).
 *
 *
 * Esto está para por ejemplo, para mostrar datos del usuario en el front después del login.
 */

public record AuthResponse(String username, com.backend.gestorActividades.models.enums.RolUser role) {}