package com.backend.gestorActividades.dto;

import com.backend.gestorActividades.models.enums.RolUser;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO PARA RESPUESTA DE USUARIOS, SIN CONTRASEÑA Y CON ESTADÍSTICAS DE RESERVAS
 */

@Data
public class UserDTO {
    private String id;
    private String name;
    private String surname;
    private String username;
    private RolUser rol;
    private LocalDateTime createdAt;
    private boolean isActive;
    private long totalReserves;
}