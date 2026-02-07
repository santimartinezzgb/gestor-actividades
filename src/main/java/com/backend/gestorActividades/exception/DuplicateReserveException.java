package com.backend.gestorActividades.exception;

/**
 * Exception to indicate that a duplicate reservation has been attempted for the same user and activity.
 */

public class DuplicateReserveException extends RuntimeException {
    public DuplicateReserveException(String message) {
        super(message);
    }
}