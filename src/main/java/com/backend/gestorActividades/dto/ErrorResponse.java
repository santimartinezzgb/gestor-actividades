package com.backend.gestorActividades.dto;

import java.time.LocalDateTime;

/**
 * DTO para representar la estructura de una respuesta de error en la API.
 * Contiene información sobre el estado del error, un mensaje descriptivo y un timestamp.
 */

public record ErrorResponse(
        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {}