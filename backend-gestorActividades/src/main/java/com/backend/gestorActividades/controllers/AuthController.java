package com.backend.gestorActividades.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.gestorActividades.dto.AuthDTO;
import com.backend.gestorActividades.dto.LoginDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO> login(
            @RequestBody LoginDTO request
    ) {
        AuthDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody User user
    ) {
        return ResponseEntity.ok(authService.register(user));
    }
}