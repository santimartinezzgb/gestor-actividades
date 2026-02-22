package com.backend.gestorActividades.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.gestorActividades.dto.PasswordUpdateRequest;
import com.backend.gestorActividades.dto.UserDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.RolUser;
import com.backend.gestorActividades.repositories.ReserveRepository;
import com.backend.gestorActividades.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ReserveRepository reserveRepository;

    public UserController(UserService userService, ReserveRepository reserveRepository) {
        this.userService = userService;
        this.reserveRepository = reserveRepository;
    }

    private UserDTO convertToDTO(User user) {

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setRol(user.getRol());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActive(user.isActive());

        dto.setTotalReserves(reserveRepository.countByUserIdAndState(user.getId(),
                com.backend.gestorActividades.models.enums.ReserveState.CONFIRMED));

        return dto;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll(
            @RequestParam(required = false) String role
    ) {
        List<User> users;
        if (role != null && !role.isEmpty()) {

            try {
                String cleanRole = role.toUpperCase().replace("ROLE_", "");
                RolUser rolEnum = RolUser.valueOf(cleanRole);
                users = userService.getUsersByRole(rolEnum);
            } catch (IllegalArgumentException e) {
                // SI EL ROL NO ES VÁLIDO, DEVOLVER TODOS (¿O VACÍO?) - HAGAMOS TODOS POR
                // ROBUSTEZ
                users = userService.getUsers();
            }
        } else {
            users = userService.getUsers();
        }

        return ResponseEntity.ok(users.stream()
                .map(this::convertToDTO).toList());
    }

    @GetMapping("/username/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @PathVariable String id
    ) {
        return userService.getUserById(id)

                .map(this::convertToDTO)

                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(
            @PathVariable String username
    ) {
        return userService.getUserByUsername(username)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(
            @RequestBody User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToDTO(userService.saveUser(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable String id,
            @RequestBody User user
    ) {
        user.setId(id);
        return ResponseEntity.ok(convertToDTO(userService.saveUser(user)));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivate(
            @PathVariable String id
    ) {

        return userService.deactivateUser(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id
    ) {
        return userService.deleteUser(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(
            @PathVariable String id,
            @RequestBody PasswordUpdateRequest request
    ) {
        try {
            userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}