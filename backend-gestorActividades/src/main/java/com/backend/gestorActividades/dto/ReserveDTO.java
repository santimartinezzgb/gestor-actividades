package com.backend.gestorActividades.dto;

import java.time.LocalDateTime;

import com.backend.gestorActividades.models.enums.ReserveState;

import lombok.Data;

@Data
public class ReserveDTO {
    private String id;

    private String userId;
    private String username;

    private String activityId;
    private String activityName;
    private LocalDateTime activityDate;

    private LocalDateTime reservedAt;
    private ReserveState state;
}