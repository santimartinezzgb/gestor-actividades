package com.backend.gestorActividades.services;

import com.backend.gestorActividades.dto.AuthResponse;
import com.backend.gestorActividades.dto.LoginRequest;
import com.backend.gestorActividades.exception.DuplicateUserException;
import com.backend.gestorActividades.exception.InvalidCredentialsException;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.RolUser;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder; // ENCODE PASSWORDS

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // USER REGISTRATION
    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException("Username already exists");
        }

        // PASSWORD ENCODING
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // DEFALUT VALUES (ACTIVE, CREATED_AT, ROL)
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        if (user.getRol() == null) {
            user.setRol(RolUser.USER);
        }

        return userRepository.save(user);
    }

    // USER LOGIN
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new InvalidCredentialsException("User or password incorrect"));

        // CHECK PASSWORD
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("User or password incorrect");
        }

        // RETURN USERNAME AND ROL
        return new AuthResponse(user.getUsername(), user.getRol());
    }
}