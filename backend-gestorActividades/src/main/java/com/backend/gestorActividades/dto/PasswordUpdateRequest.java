package com.backend.gestorActividades.dto;

import lombok.Data;

/**
 * DTO PARA ACTUALIZAR CONTRASEÑA
 */

@Data
public class PasswordUpdateRequest {
    private String oldPassword;
    private String newPassword;
}
