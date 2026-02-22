package com.backend.gestorActividades.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthDTO {
    private String userId;
    private String username;
    private String role;
    private String message;
    private String token;
}