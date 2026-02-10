package com.backend.gestorActividades.dto;

import com.backend.gestorActividades.models.enums.RolUser;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO TO RESPONSE TO ALL USER DATA ( whitout password )
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
}