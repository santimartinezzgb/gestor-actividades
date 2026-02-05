package com.backend.gestorActividades.models;

import com.backend.gestorActividades.models.enums.RolUser;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private RolUser rol;
    private LocalDateTime createdAt;
    private boolean isActive;
}
