package com.backend.gestorActividades.dto;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO PARA EXPONER LOS DATOS DE UNA RESERVA DE MANERA CONTROLADA EN LA API
 */

@Data
public class ReserveDTO {
    private String id;

    // DATOS DEL USUARIO ( sin exponer datos sensibles )
    private String userId;
    private String username;

    // DATOS DE LA ACTIVIDAD
    private String activityId;
    private String activityName;
    private LocalDateTime activityDate;

    // DATOS DE LA RESERVA
    private LocalDateTime reservedAt;
    private ReserveState state;
}