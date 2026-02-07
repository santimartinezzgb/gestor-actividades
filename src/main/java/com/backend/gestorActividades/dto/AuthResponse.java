package com.backend.gestorActividades.dto;

/**
 * DTO para la respuesta de autenticación, que incluye el token JWT, el nombre de usuario y el rol del usuario.
 *
 * @param token    El token JWT generado para el usuario autenticado.
 * @param username El nombre de usuario del usuario autenticado.
 * @param role     El rol del usuario autenticado (por ejemplo, ADMIN o USER).
 */

public record AuthResponse(String token, String username, com.backend.gestorActividades.models.enums.RolUser role) {}