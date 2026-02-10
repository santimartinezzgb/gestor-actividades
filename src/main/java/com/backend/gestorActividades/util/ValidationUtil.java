package com.backend.gestorActividades.util;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    // --- MÉTODOS EXISTENTES ---

    public static void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email format is invalid.");
        }
    }

    public static void validateNotNull(Object object, String fieldName) {
        if (object == null) {
            throw new IllegalArgumentException("The field " + fieldName + " cannot be null.");
        }
    }

    public static void validateStringNotEmpty(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("The field " + fieldName + " cannot be empty.");
        }
    }

    public static void validateMinLength(String value, int min, String fieldName) {
        if (value != null && value.length() < min) {
            throw new IllegalArgumentException(fieldName + " must be at least " + min + " characters long.");
        }
    }

    // --- NUEVO MÉTODO DE VALIDACIÓN DE FECHA ---

    /**
     * Valida que la fecha de la actividad sea al menos 24 horas después de ahora.
     */
    public static void validateActivityDate(LocalDateTime activityDate) {
        validateNotNull(activityDate, "Activity Date");

        LocalDateTime minimumAllowedDate = LocalDateTime.now().plusDays(1);

        if (activityDate.isBefore(minimumAllowedDate)) {
            throw new IllegalArgumentException("La actividad debe crearse con al menos 24 horas de antelación.");
        }
    }
}