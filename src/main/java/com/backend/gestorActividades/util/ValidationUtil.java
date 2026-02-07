package com.backend.gestorActividades.util;

import java.util.regex.Pattern;

/**
 * Utilidad para validaciones comunes en la aplicación.
 */

public class ValidationUtil {

    // Expresión regular para email (estándar RFC 5322)
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    // Ejemplo: Validar que una contraseña sea fuerte (mínimo 8 caracteres, una letra y un número)
    private static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$";

    /**
     * Valida si un objeto es nulo o, en caso de ser String, si está vacío.
     */
    public static boolean isNullOrEmpty(Object obj) {
        if (obj == null) return true;
        if (obj instanceof String) return ((String) obj).trim().isEmpty();
        return false;
    }

    /**
     * Valida el formato de un email.
     */
    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        return Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }

    /**
     * Valida que un texto no exceda un máximo de caracteres.
     */
    public static boolean isWithinLength(String text, int maxLength) {
        return text != null && text.length() <= maxLength;
    }

    /**
     * Valida si un String puede ser convertido a un número positivo.
     */
    public static boolean isPositiveNumber(String str) {
        try {
            return Double.parseDouble(str) > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}