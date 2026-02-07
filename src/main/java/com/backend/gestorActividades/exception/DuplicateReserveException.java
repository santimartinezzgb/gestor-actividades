package com.backend.gestorActividades.exception;

/**
 * Excepción personalizada para indicar que se ha intentado realizar una reserva duplicada para la misma actividad y usuario.
 */

public class DuplicateReserveException extends RuntimeException {
    public DuplicateReserveException(String message) {
        super(message);
    }
}