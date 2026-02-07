package com.backend.gestorActividades.services;

import com.backend.gestorActividades.dto.AuthResponse;
import com.backend.gestorActividades.dto.LoginRequest;
import com.backend.gestorActividades.models.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthService(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Spring Security intenta autenticar (usa tu UserDetailsServiceImpl internamente)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Si no lanza excepción, el login es correcto. Obtenemos el rol.
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        return new AuthResponse(request.getUsername(), role, "¡Bienvenido de nuevo!");
    }

    public User register(User user) {
        // Reutilizamos tu UserService que ya tiene las validaciones y el BCrypt
        return userService.saveUser(user);
    }
}