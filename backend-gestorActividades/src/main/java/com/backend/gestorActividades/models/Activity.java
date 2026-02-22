package com.backend.gestorActividades.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "activities")
@Data
@NoArgsConstructor
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