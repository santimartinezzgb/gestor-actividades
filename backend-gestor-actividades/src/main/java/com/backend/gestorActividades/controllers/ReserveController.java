package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.ReserveDTO;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.services.ReserveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reserves")
public class ReserveController {

    private final ReserveService reserveService;

    public ReserveController(ReserveService reserveService) {
        this.reserveService = reserveService;
    }

    // CONVERTIR RESERVA A RESERVA DTO ( PARA CONTROLAR QUÉ SE EXPONE EN LA API)
    private ReserveDTO convertToDTO(Reserve reserve) {
        if (reserve == null) return null;

        // CREAR DTO Y MAPEAR CAMPOS BÁSICOS
        ReserveDTO dto = new ReserveDTO();
        dto.setId(reserve.getId());
        dto.setReservedAt(reserve.getReservedAt());
        dto.setState(reserve.getState());

        if (reserve.getUser() != null) {
            try {
                // EXPONER SOLO ID Y USERNAME DEL USUARIO
                dto.setUserId(reserve.getUser().getId());
                dto.setUsername(reserve.getUser().getUsername());
            } catch (Exception e) {
                dto.setUsername("User not available");
            }
        }

        if (reserve.getActivity() != null) {
            try {
                // EXPONER SOLO ID, NAME Y DATE DE LA ACTIVIDAD
                dto.setActivityId(reserve.getActivity().getId());
                dto.setActivityName(reserve.getActivity().getName());
                dto.setActivityDate(reserve.getActivity().getDate());
            } catch (Exception e) {
                dto.setActivityName("Activity not available");
            }
        }
        return dto;
    }


    /**
     * ENDPOINTS PARA GESTIONAR RESERVAS ( CON DTO )
     */

    // OBTENER TODAS LAS RESERVAS
    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAll() {
        List<ReserveDTO> list = reserveService.getReserves().stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(list);
    }

    // OBTENER RESERVA POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ReserveDTO> getById(@PathVariable String id) {
        Reserve reserve = reserveService.getReserveById(id);
        return reserve != null
                ? ResponseEntity.ok(convertToDTO(reserve))
                : ResponseEntity.notFound().build();
    }

    // CREAR NUEVA RESERVA
    @PostMapping
    public ResponseEntity<ReserveDTO> create(@RequestBody Reserve reserve) {
        Reserve saved = reserveService.createReserve(reserve);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    // ACTUALIZAR RESERVA EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<ReserveDTO> update(@PathVariable String id, @RequestBody Reserve reserve) {
        reserve.setId(id);
        return ResponseEntity.ok(convertToDTO(reserveService.updateReserve(id, reserve)));
    }

    // CANCELAR RESERVA
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReserveDTO> cancel(@PathVariable String id) {
        return ResponseEntity.ok(convertToDTO(reserveService.cancelReserve(id)));
    }

    // ELIMINAR RESERVA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        reserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}