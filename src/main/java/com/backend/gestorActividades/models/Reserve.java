package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "reserves")
@Data
@Getter
@Setter
@NoArgsConstructor
public class Reserve {
    @Id
    private String id;
    @DBRef
    private User user; // Reference to User
    @DBRef
    private Activity activity; // Reference to Activity
    private LocalDateTime reservedAt;
    private ReserveState state; // CONFIRMED, CANCELED

}
