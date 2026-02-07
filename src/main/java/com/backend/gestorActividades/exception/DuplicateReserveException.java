package com.backend.gestorActividades.exception;

public class DuplicateReserveException extends RuntimeException {
    public DuplicateReserveException(String message) {
        super(message);
    }
}