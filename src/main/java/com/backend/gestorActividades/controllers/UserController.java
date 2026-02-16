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

    // PASO MUY IMPORTANTE PARA LA SEGURIDAD
    // CONVERTIR LA ENTIDAD USUARIO A DTO PARA EVITAR EXPONER DATOS SENSIBLES COMO
    // LA CONTRASEÑA
    // EL DTO ES UN MODELO DE USUARIO SIN EL CAMPO CONTRASEÑA
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setUsername(user.getUsername());
        dto.setRol(user.getRol());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActive(user.isActive());

        // AÑADIR ESTADÍSTICAS DE USUARIO (Solo las confirmadas)
        dto.setTotalReserves(reserveRepository.countByUserIdAndState(user.getId(),
                com.backend.gestorActividades.models.enums.ReserveState.CONFIRMED));

        return dto;
    }

    // OBTENER TODOS LOS USUARIOS ( Usando DTO )
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll(@RequestParam(required = false) String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
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
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.getUserById(id)

                // CONVERTIR EL USUARIO A DTO
                .map(this::convertToDTO)

                // SI SE ENCUENTRA EL USUARIO, DEVOLVER 200 OK
                .map(ResponseEntity::ok)

                // SI NO SE ENCUENTRA EL USUARIO, DEVOLVER 404 NOT FOUND
                .orElse(ResponseEntity.notFound().build());
    }

    // OBTENER USUARIO POR NOMBRE DE USUARIO ( Usando DTO )
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR NUEVO USUARIO ( Usando DTO )
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody User user) {

        // DEVOLVER ESTADO 201 CREATED
        return ResponseEntity.status(HttpStatus.CREATED)

                // CONVERTIR EL USUARIO CREADO A DTO ANTES DE DEVOLVERLO
                .body(convertToDTO(userService.saveUser(user)));
    }

    // ACTUALIZAR USUARIO EXISTENTE ( Usando DTO )
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable String id,
            @RequestBody User user) {
        // ESTABLECER ID
        user.setId(id);
        // GUARDAR EL USUARIO ACTUALIZADO Y CONVERTIRLO A DTO ANTES DE DEVOLVERLO
        return ResponseEntity.ok(convertToDTO(userService.saveUser(user)));
    }

    // DESACTIVAR USUARIO POR ID ( Usando DTO )
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivate(@PathVariable String id) {

        return userService.deactivateUser(id)

                // CONVERTIR A DTO
                .map(this::convertToDTO)
                // DEVOLVER 200 OK SI EL USUARIO SE DESACTIVÓ CORRECTAMENTE
                .map(ResponseEntity::ok)
                // DEVOLVER 404 NOT FOUND SI EL USUARIO NO FUE ENCONTRADO
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR USUARIO POR ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return userService.deleteUser(id)
                ? ResponseEntity.noContent().build() // DEVOLVER 204 NO CONTENT SI EL USUARIO FUE ELIMINADO
                : ResponseEntity.notFound().build(); // DEVOLVER 404 NOT FOUND SI EL USUARIO NO FUE ENCONTRADO
    }

    // ACTUALIZAR CONTRASEÑA
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable String id,
            @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updatePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}