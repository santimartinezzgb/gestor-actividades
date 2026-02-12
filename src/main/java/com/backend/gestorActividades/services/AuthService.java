package com.backend.gestorActividades.services;

import com.backend.gestorActividades.dto.AuthResponse;
import com.backend.gestorActividades.dto.LoginRequest;
import com.backend.gestorActividades.models.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(r -> r.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("USER");

            User user = userService.getUserByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            return new AuthResponse(user.getId(), request.getUsername(), role, "¡WELCOME!");

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Credenciales incorrectas");
        }
    }

    public User register(User user) {
        // Quitamos el passwordEncoder de aquí.
        // UserService.saveUser ya se encarga de encriptar.
        return userService.saveUser(user);
    }
}