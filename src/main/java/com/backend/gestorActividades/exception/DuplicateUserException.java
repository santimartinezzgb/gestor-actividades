package com.backend.gestorActividades.exception;

/**
 * EXCEPCIÓN PARA CUANDO:
 * - SE INTENTA REGISTRAR UN USUARIO CON UN USERNAME QUE YA EXISTE EN LA BASE DE DATOS.
 *
 */

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
