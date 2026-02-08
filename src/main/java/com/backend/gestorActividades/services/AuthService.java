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

    // AUTHENTICATE USER AND RETURN ROLE
    public AuthResponse login(LoginRequest request) {
        // SPRING SECURITY TRY TO AUTHENTICATE THE USER WITH THE PROVIDED CREDENTIALS
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // IF NOT, THROW AN EXCEPTION (HANDLED BY SPRING SECURITY)
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        // RETURN THE AUTH RESPONSE WITH THE USERNAME, ROLE AND A WELCOME MESSAGE
        return new AuthResponse(request.getUsername(), role, "¡WELCOME!");
    }

    // SAVE NEW USER ( REGISTRATION )
    public User register(User user) {
        return userService.saveUser(user);
    }
}