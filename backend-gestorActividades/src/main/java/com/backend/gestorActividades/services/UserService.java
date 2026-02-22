package com.backend.gestorActividades.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.RolUser;
import com.backend.gestorActividades.repositories.UserRepository;
import com.backend.gestorActividades.util.ValidationUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(RolUser rol) {
        return userRepository.findByRol(rol);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        ValidationUtil.validateStringNotEmpty(user.getUsername(), "Username");
        ValidationUtil.validateStringNotEmpty(user.getPassword(), "Password");

        if (user.getId() == null) {
            if (user.getPassword().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters.");
            }

            if (userRepository.existsByUsername(user.getUsername())) {
                throw new com.backend.gestorActividades.exception.DuplicateUserException("Username already exists");
            }

            // SE AÑADE 2a$ PARA IDENTIFICAR QUE YA ESTÁ ENCRIPTADA (ESTÁNDAR DE BCRYPT)
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            user.setActive(true);
            if (user.getRol() == null)
                user.setRol(RolUser.USER);
        } else {
            throw new IllegalArgumentException("Updating existing users is not allowed through this method.");
        }
        return userRepository.save(user);
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<User> deactivateUser(String id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(false);
                    return userRepository.save(user);
                });
    }

    public void updatePassword(String userId, String oldPassword, String newPassword) {

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password can't be empty");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}