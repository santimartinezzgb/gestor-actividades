package com.backend.gestorActividades.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO TO RESPONSE FOR AUTHENTICATION
 */

@Data
@AllArgsConstructor
public class AuthResponse {
    private String userId;
    private String username;
    private String role;
    private String message;
}