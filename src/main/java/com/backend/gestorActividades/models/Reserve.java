package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.*;
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
    private User user; // Reference to User
    private Activity activity; // Reference to Activity
    private LocalDateTime reservedAt;
    private ReserveState state; // CONFIRMED, CANCELED

}
