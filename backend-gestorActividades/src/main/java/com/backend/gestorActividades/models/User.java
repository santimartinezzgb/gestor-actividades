package com.backend.gestorActividades.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;

import com.backend.gestorActividades.models.enums.RolUser;

import lombok.Data;
import lombok.NoArgsConstructor;

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

    @CreatedDate
    @ReadOnlyProperty
    private LocalDateTime createdAt;

    private boolean isActive = true;
}