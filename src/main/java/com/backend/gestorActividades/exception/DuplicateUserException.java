package com.backend.gestorActividades.exception;

/**
 * Excepción personalizada para indicar que se ha intentado registrar un usuario con un nombre de usuario o correo electrónico que ya existe en el sistema.
 */

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
