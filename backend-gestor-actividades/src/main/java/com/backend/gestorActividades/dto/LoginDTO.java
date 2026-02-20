package com.backend.gestorActividades.dto;

import lombok.Data;

/**
 * DTO TO LOGIN REQUEST
 */

@Data
public class LoginDTO {
    private String username;
    private String password;
}