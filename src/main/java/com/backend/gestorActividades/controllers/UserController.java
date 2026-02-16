package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.PasswordUpdateRequest;
import com.backend.gestorActividades.dto.UserDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.repositories.ReserveRepository;
import com.backend.gestorActividades.services.UserService;
import com.backend.gestorActividades.models.enums.RolUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ReserveRepository reserveRepository;

    public UserController(UserService userService, ReserveRepository reserveRepository) {
        this.userService = userService;
        this.reserveRepository = reserveRepository;
    }

    // VERY IMPORTANT STEP TO SECURITY
    // CONVERT USER ENTITY TO DTO TO AVOID EXPOSING SENSITIVE DATA LIKE PASSWORD
    // DTO IS A USER MODEL WITHOUT THE PASSWORD FIELD
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setRol(user.getRol());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActive(user.isActive());

        // ADD USER STATISTICS (Only confirmed ones)
        dto.setTotalReserves(reserveRepository.countByUserIdAndState(user.getId(),
                com.backend.gestorActividades.models.enums.ReserveState.CONFIRMED));

        return dto;
    }

    // GET ALL USERS ( Using DTO )
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll(@RequestParam(required = false) String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
            try {
                // CLEAN THE ROLE STRING IN CASE IT HAS "ROLE_"
                String cleanRole = role.toUpperCase().replace("ROLE_", "");
                RolUser rolEnum = RolUser.valueOf(cleanRole);
                users = userService.getUsersByRole(rolEnum);
            } catch (IllegalArgumentException e) {
                // IF ROLE IS INVALID, RETURN ALL (OR EMPTY?) - LET'S DO ALL FOR ROBUSTNESS
                users = userService.getUsers();
            }
        } else {
            users = userService.getUsers();
        }

        return ResponseEntity.ok(users.stream()
                // CONVERT EACH USER TO DTO BEFORE RETURNING THE LIST
                .map(this::convertToDTO).toList());
    }

    // GET USER BY ID ( Using DTO )
    @GetMapping("/username/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.getUserById(id)

                // CONVERT THE USER TO DTO
                .map(this::convertToDTO)

                // IF THE USER IS FOUND, RETURN THE 200 OK
                .map(ResponseEntity::ok)

                // IF THE USER IS NOT FOUND, RETURN 404 NOT FOUND
                .orElse(ResponseEntity.notFound().build());
    }

    // GET USER BY USERNAME ( Using DTO )
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE NEW USER ( Using DTO )
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody User user) {

        // RETURN 201 CREATED STATUS
        return ResponseEntity.status(HttpStatus.CREATED)

                // CONVERT THE CREATED USER TO DTO BEFORE RETURNING IT
                .body(convertToDTO(userService.saveUser(user)));
    }

    // UPDATE EXISTING USER ( Using DTO )
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable String id,
            @RequestBody User user) {
        // SET ID
        user.setId(id);
        // SAVE THE UPDATED USER AND CONVERT IT TO DTO BEFORE RETURNING IT
        return ResponseEntity.ok(convertToDTO(userService.saveUser(user)));
    }

    // DEACTIVATE USER BY ID ( Using DTO )
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivate(@PathVariable String id) {

        return userService.deactivateUser(id)

                // CONVERT TO DTO
                .map(this::convertToDTO)
                // RETURN 200 OK IF THE USER WAS DEACTIVATED SUCCESSFULLY
                .map(ResponseEntity::ok)
                // RETURN 404 NOT FOUND IF THE USER WAS NOT FOUND
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE USER BY ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return userService.deleteUser(id)
                ? ResponseEntity.noContent().build() // RETURN 204 NO CONTENT IF USER WAS DELETED
                : ResponseEntity.notFound().build(); // RETURN 404 NOT FOUND IF USER WAS NOT FOUND
    }

    // UPDATE PASSWORD
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable String id,
            @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Contraseña actualizada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}