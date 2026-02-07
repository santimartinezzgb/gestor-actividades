package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.dto.ReserveDTO;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.services.ReserveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reserves")
public class ReserveController {

    private final ReserveService reserveService;

    public ReserveController(ReserveService reserveService) {
        this.reserveService = reserveService;
    }

    // CONVERT RESERVE TO RESERVEDTO ( TO AVOID CIRCULAR REFERENCES AND CONTROL WHAT WE EXPOSE IN THE API )
    private ReserveDTO convertToDTO(Reserve reserve) {
        if (reserve == null) return null;
        ReserveDTO dto = new ReserveDTO();
        dto.setId(reserve.getId());
        dto.setReservedAt(reserve.getReservedAt());
        dto.setState(reserve.getState());

        if (reserve.getUser() != null) { // AVOID nullPointerException IF USER IS NOT LOADED
            dto.setUserId(reserve.getUser().getId());
            dto.setUsername(reserve.getUser().getUsername());
        }

        if (reserve.getActivity() != null) { // AVOID nullPointerException IF ACTIVITY IS NOT LOADED
            dto.setActivityId(reserve.getActivity().getId());
            dto.setActivityName(reserve.getActivity().getName());
            dto.setActivityDate(reserve.getActivity().getDate());
        }
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAll() {
        List<ReserveDTO> list = reserveService.getReserves().stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReserveDTO> getById(@PathVariable String id) {
        Reserve reserve = reserveService.getReserveById(id);
        return reserve != null
                ? ResponseEntity.ok(convertToDTO(reserve))
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ReserveDTO> create(@RequestBody Reserve reserve) {
        Reserve saved = reserveService.createReserve(reserve);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReserveDTO> update(@PathVariable String id, @RequestBody Reserve reserve) {
        reserve.setId(id); // <--- Forzamos que use el ID de la ruta
        return ResponseEntity.ok(convertToDTO(reserveService.updateReserve(id, reserve)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReserveDTO> cancel(@PathVariable String id) {
        return ResponseEntity.ok(convertToDTO(reserveService.cancelReserve(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        reserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}