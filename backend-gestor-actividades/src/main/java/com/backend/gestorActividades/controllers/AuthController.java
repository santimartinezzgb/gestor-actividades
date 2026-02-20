package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.AuthDTO;
import com.backend.gestorActividades.dto.LoginDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ENDPOINT PARA INICIAR SESIÓN
    @PostMapping("/login")
    public ResponseEntity<AuthDTO> login(
            @RequestBody LoginDTO request // RECIBE UN OBJETO LoginDTO CON username Y password CON LA PETICIÓN
    ) {
        AuthDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(
            @RequestBody User user // RECIBE UN OBJETO User CON username, password Y rol CON LA PETICIÓN
    ) {
        return ResponseEntity.ok(authService.register(user));
    }
}