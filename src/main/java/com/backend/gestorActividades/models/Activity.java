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

    private LocalDateTime date;
    private int capacity;
    private int reservedCount = 0;
    private boolean isActive = true;
}