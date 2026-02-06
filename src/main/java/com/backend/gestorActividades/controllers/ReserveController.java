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
@RequestMapping("/reserves")
public class ReserveController {

    @Autowired
    private ReserveService reserveService;

    // GET
    @GetMapping("/getReserves")
    public ResponseEntity<List<Reserve>> getReserves() {
        return ResponseEntity.ok(reserveService.getReserves());
    }
    @GetMapping("/getReserveById/{id}")
    public Reserve getReserveById(@PathVariable String id) {
        return reserveService.getReserveById(id);
    }

    // POST
    @PostMapping("/postReserve")
    public ResponseEntity<Reserve> createReserve(@RequestBody Reserve reserve) {
        Reserve savedReserve = reserveService.createReserve(reserve);
        return  ResponseEntity.status(HttpStatus.CREATED).body(savedReserve);
    }

    // PUT
    @PutMapping("/putReserve/{id}")
    public ResponseEntity<Reserve> updateReserve(@PathVariable String id, @RequestBody Reserve reserve) {
        Reserve updatedReserve = reserveService.updateReserve(id, reserve);
        return ResponseEntity.ok(updatedReserve);
    }

    // DELETE
    @DeleteMapping("/deleteReserve/{id}")
    public ResponseEntity<Void> deleteReserve(@PathVariable String id) {
        reserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}
