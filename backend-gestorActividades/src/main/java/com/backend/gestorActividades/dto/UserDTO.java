package com.backend.gestorActividades.dto;

import java.time.LocalDateTime;

import com.backend.gestorActividades.models.enums.RolUser;

import lombok.Data;

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