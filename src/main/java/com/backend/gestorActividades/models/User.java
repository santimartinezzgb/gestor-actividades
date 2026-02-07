package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.RolUser;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private RolUser rol;

    @CreatedDate // Se asigna automáticamente al insertar
    @ReadOnlyProperty
    private LocalDateTime createdAt;

    private boolean isActive = true; // Valor por defecto más sencillo
}