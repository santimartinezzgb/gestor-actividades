package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.UserDTO;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // VERY IMPORTANT STEP TO SECURITY
    // CONVERT USER ENTITY TO DTO TO AVOID EXPOSING SENSITIVE DATA LIKE PASSWORD
    // DTO IS A USER MODEL WITHOUT THE PASSWORD FIELD
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRol(user.getRol());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActive(user.isActive());
        return dto;
    }

    // GET ALL USERS ( Using DTO )
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getUsers().stream()

                // CONVERT EACH USER TO DTO BEFORE RETURNING THE LIST
                .map(this::convertToDTO).toList());
    }

    // GET USER BY USERNAME ( Using DTO )
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
}