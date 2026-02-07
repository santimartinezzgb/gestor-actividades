package com.backend.gestorActividades.models;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "activities")
@Data // Esto ya incluye Getters, Setters, ToString, EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    @Id
    private String id;

    private String name;
    private String description;

    // Es recomendable inicializar valores por defecto para evitar Nulls en la DB
    private LocalDateTime date;
    private int capacity;
    private boolean isActive = true;
}