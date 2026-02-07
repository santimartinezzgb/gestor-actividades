package com.backend.gestorActividades.dto;

import com.backend.gestorActividades.models.enums.ReserveState;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO TO RESPONSE TO ALL DATA OF A RESERVATION
 */

@Data
public class ReserveDTO {
    private String id;

    // USER DATA ( whitout password )
    private String userId;
    private String username;

    // ACTIVITY DATA
    private String activityId;
    private String activityName;
    private LocalDateTime activityDate;

    // RESERVATION DATA
    private LocalDateTime reservedAt;
    private ReserveState state;
}