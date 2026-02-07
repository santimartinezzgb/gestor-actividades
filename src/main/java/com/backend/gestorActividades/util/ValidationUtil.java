package com.backend.gestorActividades.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    // FORMAT EMAIL
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    // VALIDATE FORMAT OF EMAIL
    public static void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email format is invalid.");
        }
    }

    // VALIDATE OBJECT NOT NULL
    public static void validateNotNull(Object object, String fieldName) {
        if (object == null) {
            throw new IllegalArgumentException("The field " + fieldName + " cannot be null.");
        }
    }

    // VALIDATE FIELD NOT EMPTY (STRING)
    public static void validateStringNotEmpty(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo " + fieldName + " no puede estar vacío.");
        }
    }

    // VALIDATE MINIMUM LENGTH OF A STRING
    public static void validateMinLength(String value, int min, String fieldName) {
        if (value != null && value.length() < min) {
            throw new IllegalArgumentException(fieldName + " debe tener al menos " + min + " caracteres.");
        }
    }
}