package com.backend.gestorActividades.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO TO RESPONSE FOR AUTHENTICATION
 */

@Data // GENERA GETTERS, SETTERS, toString, equals Y hashCode AUTOMÁTICAMENTE
@AllArgsConstructor // EVITA NECESIDAD DE CONSTRUCTOR, GETTERS Y SETTERS MANUALES
public class AuthDTO {
    private String userId;
    private String username;
    private String role;
    private String message;
}