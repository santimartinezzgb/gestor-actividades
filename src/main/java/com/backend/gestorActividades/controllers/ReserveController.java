package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.services.ReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reserve")
public class ReserveController {

    @Autowired
    private ReserveService reserveService;

    // GET
    @GetMapping("/api/reserves")
    public ResponseEntity<List<Reserve>> getReserves() {
        return ResponseEntity.ok(reserveService.getReserves());
    }
    @GetMapping("/api/reserves/{id}")
    public Reserve getReserveById(@PathVariable Long id) {
        return reserveService.getReserveById(id);
    }

    // POST
    @PostMapping("/api/reserves")
    public ResponseEntity<Reserve> createReserve(@RequestBody Reserve reserve) {
        Reserve savedReserve = reserveService.createReserve(reserve);
        return  ResponseEntity.status(HttpStatus.CREATED).body(savedReserve);
    }

    // PUT
    @PutMapping("/api/reserves/{id}")
    public ResponseEntity<Reserve> updateReserve(@PathVariable Long id, @RequestBody Reserve reserve) {
        Reserve updatedReserve = reserveService.updateReserve(id, reserve);
        return ResponseEntity.ok(updatedReserve);
    }

    // DELETE
    @DeleteMapping("/api/reserves/{id}")
    public ResponseEntity<Void> deleteReserve(@PathVariable Long id) {
        reserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}
