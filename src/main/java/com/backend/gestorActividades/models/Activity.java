package com.backend.gestorActividades.models;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "activities")
@Data
@Getter
@Setter
@NoArgsConstructor
public class Activity {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime date;
    private int capacity;
    private boolean isActive;
}
