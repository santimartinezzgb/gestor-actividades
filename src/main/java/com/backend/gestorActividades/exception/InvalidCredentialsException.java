package com.backend.gestorActividades.exception;

/**
 * Excepción personalizada para indicar que las credenciales proporcionadas son inválidas.
 */

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
