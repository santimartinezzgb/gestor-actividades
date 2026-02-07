package com.backend.gestorActividades.exception;

/**
 * Exception to indicate that a duplicate user registration has been attempted with the same username.
 */

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
