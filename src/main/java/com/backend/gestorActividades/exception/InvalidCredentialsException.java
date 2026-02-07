package com.backend.gestorActividades.exception;

/**
 * Exception to indicate that the provided credentials for authentication are invalid.
 */

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
