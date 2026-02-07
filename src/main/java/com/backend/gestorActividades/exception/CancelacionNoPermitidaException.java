package com.backend.gestorActividades.exception;


/**
 * Excepción personalizada para indicar que la cancelación de una reserva no está permitida.
 */

public class CancelacionNoPermitidaException extends RuntimeException {
    public CancelacionNoPermitidaException(String message) {
        super(message);
    }
}