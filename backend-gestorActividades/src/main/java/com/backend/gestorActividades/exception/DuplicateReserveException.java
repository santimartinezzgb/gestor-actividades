package com.backend.gestorActividades.exception;

/**
 * EXCEPCIÓN PARA CUANDO:
 * - Se intenta reservar una actividad que ya ha sido reservada por el mismo usuario.
 * - Se intenta reservar una actividad que ya ha sido reservada por otro usuario.
 */

public class DuplicateReserveException extends RuntimeException {
    public DuplicateReserveException(String message) {
        super(message);
    }
}