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
    private String name;
    private String surname;
    private String username;
    private String password;
    private RolUser rol;

    @CreatedDate // FECHA AUTOMÁTICA CUANDO SE CREA EL DOCUMENTO
    @ReadOnlyProperty
    private LocalDateTime createdAt;

    private boolean isActive = true; // POR DEFECTO TRUE
}