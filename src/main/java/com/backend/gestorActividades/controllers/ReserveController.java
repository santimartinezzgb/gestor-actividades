package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.services.ReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reserves") // Versiona tu API
public class ReserveController {

    private final ReserveService reserveService;

    // Constructor injection: mejor para testing y seguridad
    public ReserveController(ReserveService reserveService) {
        this.reserveService = reserveService;
    }

    @GetMapping
    public ResponseEntity<List<Reserve>> getAll() {
        return ResponseEntity.ok(reserveService.getReserves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserve> getById(@PathVariable String id) {
        // Manejamos el null aquí para devolver 404 si no existe
        Reserve reserve = reserveService.getReserveById(id);
        return reserve != null ? ResponseEntity.ok(reserve) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Reserve> create(@RequestBody Reserve reserve) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reserveService.createReserve(reserve));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserve> update(@PathVariable String id, @RequestBody Reserve reserve) {
        return ResponseEntity.ok(reserveService.updateReserve(id, reserve));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        reserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}