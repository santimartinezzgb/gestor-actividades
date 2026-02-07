package com.backend.gestorActividades.exception;


/**
 * Exception to indicate that the cancellation of a reservation is not allowed.
 */

public class CancellationNotAllowedException extends RuntimeException {
    public CancellationNotAllowedException(String message) {
        super(message);
    }
}