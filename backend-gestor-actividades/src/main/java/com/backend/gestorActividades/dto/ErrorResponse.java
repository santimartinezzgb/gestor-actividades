package com.backend.gestorActividades.dto;

import java.time.LocalDateTime;

/**
 * DTO PARA RESPUESTA DE ERROR
 */

public record ErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {}