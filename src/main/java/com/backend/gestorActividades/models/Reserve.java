package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "reserves")
@Data // GENERA GETTERS, SETTERS, TO STRING, EQUALS Y HASHCODE
@NoArgsConstructor // GENERA UN CONSTRUCTOR SIN ARGUMENTOS
public class Reserve {
    @Id
    private String id;
    @DBRef(lazy = true) // lazy = true mejora el rendimiento al no cargar el usuario si no se solicita
    private User user;
    @DBRef(lazy = true)
    private Activity activity;
    private LocalDateTime reservedAt;
    private ReserveState state = ReserveState.CONFIRMED; // Estado inicial por defecto
}