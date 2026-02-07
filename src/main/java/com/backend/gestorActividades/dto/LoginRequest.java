package com.backend.gestorActividades.dto;

/**
 * DTO para representar la solicitud de inicio de sesión.
 *
 * @param username El nombre de usuario del usuario que intenta iniciar sesión.
 * @param password La contraseña del usuario que intenta iniciar sesión.
 */

public record LoginRequest(String username, String password) {}