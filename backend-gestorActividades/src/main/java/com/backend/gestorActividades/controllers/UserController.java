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

    // CONVERTIR UN USUARIO A DTO (OCULTANDO CONTRASEÑA Y AÑADIENDO ESTADÍSTICAS DE RESERVAS)
    private UserDTO convertToDTO(User user) {

        // CREAR UN NUEVO DTO Y COPIAR LOS CAMPOS NECESARIOS
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setRol(user.getRol());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActive(user.isActive());

        // AÑADIR ESTADÍSTICAS DE USUARIO
        dto.setTotalReserves(reserveRepository.countByUserIdAndState(user.getId(),
                com.backend.gestorActividades.models.enums.ReserveState.CONFIRMED));

        return dto;
    }


    /**
     * OBTENER TODOS LOS USUARIOS ( CON DTO )
     */

    // OBTENER TODOS LOS USUARIOS ( Usando DTO )
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll(
            @RequestParam(required = false) String role // PARÁMETRO OPCIONAL PARA FILTRAR POR ROL
    ) {
        List<User> users;
        if (role != null && !role.isEmpty()) {

            // CONTROL DE ERRORES PARA ROL NO VÁLIDO

            try {
                // LIMPIAR LA CADENA DEL ROL EN CASO DE QUE TENGA "ROLE_"
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
                // CONVERTIR CADA USUARIO A DTO ANTES DE DEVOLVER LA LISTA
                .map(this::convertToDTO).toList());
    }

    // OBTENER USUARIO POR ID ( Usando DTO )
    @GetMapping("/username/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @PathVariable String id
    ) {
        return userService.getUserById(id)

                // CONVERTIR EL USUARIO A DTO
                .map(this::convertToDTO)

                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // OBTENER USUARIO POR NOMBRE DE USUARIO ( Usando DTO )
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(
            @PathVariable String username
    ) {
        return userService.getUserByUsername(username)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR NUEVO USUARIO ( Usando DTO )
    @PostMapping
    public ResponseEntity<UserDTO> create(
            @RequestBody User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)

                // CONVERTIR EL USUARIO CREADO A DTO ANTES DE DEVOLVERLO
                .body(convertToDTO(userService.saveUser(user)));
    }

    // ACTUALIZAR USUARIO EXISTENTE ( Usando DTO )
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(
            @PathVariable String id,
            @RequestBody User user
    ) {
        // ESTABLECER ID
        user.setId(id);
        // GUARDAR EL USUARIO ACTUALIZADO Y CONVERTIRLO A DTO ANTES DE DEVOLVERLO
        return ResponseEntity.ok(convertToDTO(userService.saveUser(user)));
    }

    // DESACTIVAR USUARIO POR ID ( Usando DTO )
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivate(
            @PathVariable String id
    ) {

        return userService.deactivateUser(id)

                // CONVERTIR A DTO
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR USUARIO POR ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id
    ) {
        return userService.deleteUser(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // ACTUALIZAR CONTRASEÑA
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(
            @PathVariable String id,
            @RequestBody PasswordUpdateRequest request // DTO PARA ACTUALIZAR CONTRASEÑA, CONTIENE OLD Y NEW PASSWORD
    ) {
        try {
            userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}