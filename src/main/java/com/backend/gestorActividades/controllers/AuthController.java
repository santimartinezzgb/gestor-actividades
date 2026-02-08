package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.AuthResponse;
import com.backend.gestorActividades.dto.LoginRequest;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth") // AUTHENTICATION ENDPOINT. /auth
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login") // LOGIN ENDPOINT. /auth/login
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register") // REGISTER ENDPOINT. /auth/register
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(user));
    }
}