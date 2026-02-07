package com.backend.gestorActividades.exception;

import com.backend.gestorActividades.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Maneja excepciones globalmente para toda la aplicación.
 * Captura errores específicos y devuelve respuestas estructuradas con detalles.
 */

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateReserveException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateReserveException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "RESERVA_DUPLICADA",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(CancelacionNoPermitidaException.class)
    public ResponseEntity<ErrorResponse> handleCancelation(CancelacionNoPermitidaException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "CANCELACION_NEGADA",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleAuthError(InvalidCredentialsException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "AUTH_FAILED",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
}