package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "reserves")
@Data
@NoArgsConstructor
public class Reserve {
    @Id
    private String id;

    @DBRef(lazy = true) // lazy = true mejora el rendimiento al no cargar el usuario si no se pide
    private User user;

    @DBRef(lazy = true)
    private Activity activity;

    private LocalDateTime reservedAt;

    private ReserveState state = ReserveState.CONFIRMED; // Estado inicial por defecto
}