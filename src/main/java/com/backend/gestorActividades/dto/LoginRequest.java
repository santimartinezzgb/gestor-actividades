package com.backend.gestorActividades.dto;

import lombok.Data;

/**
 * DTO TO LOGIN REQUEST
 */

@Data
public class LoginRequest {
    private String username;
    private String password;
}