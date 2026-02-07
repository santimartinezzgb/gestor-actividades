package com.backend.gestorActividades.services;

import com.backend.gestorActividades.dto.AuthResponse;
import com.backend.gestorActividades.dto.LoginRequest;
import com.backend.gestorActividades.exception.DuplicateUserException;
import com.backend.gestorActividades.exception.InvalidCredentialsException;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    // En un proyecto real, aquí inyectarías BCryptPasswordEncoder

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Buscar usuario
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new InvalidCredentialsException("Usuario o contraseña incorrectos"));

        // 2. Validar contraseña (Aquí usarías passwordEncoder.matches())
        if (!user.getPassword().equals(request.password())) {
            throw new InvalidCredentialsException("Usuario o contraseña incorrectos");
        }

        // Ya no devolvemos token JWT; devolvemos datos del usuario
        return new AuthResponse(user.getUsername(), user.getRol());
    }

    public User register(User user) {
        // Validar si ya existe
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException("El nombre de usuario ya está en uso");
        }

        // Encriptar contraseña antes de guardar
        // user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
}
