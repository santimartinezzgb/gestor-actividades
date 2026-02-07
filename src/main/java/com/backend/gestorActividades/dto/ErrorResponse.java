package com.backend.gestorActividades.dto;

import java.time.LocalDateTime;

/**
 * DTO TO REPONSE FOR ERROR
 */

public record ErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {}