package com.backend.gestorActividades.util;

import java.time.LocalDateTime;

public class ValidationUtil {

    private static void validateNotNull(Object object, String fieldName) {
        if (object == null) {
            throw new IllegalArgumentException("The field " + fieldName + " cannot be null.");
        }
    }

    public static void validateStringNotEmpty(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("The field " + fieldName + " cannot be empty.");
        }
    }


    public static void validateActivityDate(LocalDateTime activityDate) {
        validateNotNull(activityDate, "Activity Date");

        LocalDateTime minimumAllowedDate = LocalDateTime.now().plusDays(1);

        if (activityDate.isBefore(minimumAllowedDate)) {
            throw new IllegalArgumentException("Activities must be created at least 24 hours in advance.");
        }
    }
}