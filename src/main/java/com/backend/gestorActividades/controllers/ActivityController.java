package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.services.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    // SERVICIO PARA MANEJAR CADA ACTIVIDAD
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping // ENDPOINT PARA OBTENER TODAS LAS ACTIVIDADES
    public ResponseEntity<List<Activity>> getAll() {
        return ResponseEntity.ok(activityService.getActivities());
    }

    /**
     * SOLO EL ADMIN PUEDE USAR ESTOS ENDPOINTS
     */

    @PostMapping("/addActivity") // ENDPOINT PARA AÑADIR UNA ACTIVIDAD
    public ResponseEntity<Activity> addActivity(@RequestBody Activity activity) {
        // OK SI SE CREÓ CORRECTAMENTE
        return ResponseEntity.ok(activityService.saveActivity(activity));
    }

    @PutMapping("/{id}") // ACTUALIZAR ACTIVIDAD POR ID
    public ResponseEntity<Activity> updateActivity(@PathVariable String id, @RequestBody Activity activity) {
        // INSTANCIA DE LA ACTIVIDAD ACTUALIZADA
        Activity updated = activityService.updateActivity(id, activity);

        if (updated == null) {// 404 SI LA ACTIVIDAD NO FUE ENCONTRADA
            return ResponseEntity.notFound().build();
        }
        // OK SI SE ACTUALIZÓ CORRECTAMENTE
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}") // ELIMINAR ACTIVIDAD POR ID
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        // INSTANCIA DE LA ACTIVIDAD ELIMINADA
        boolean deleted = activityService.deleteActivity(id);

        // 404 SI LA ACTIVIDAD NO FUE ENCONTRADA
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        // SIN CONTENIDO SI SE ELIMINÓ CORRECTAMENTE
        return ResponseEntity.noContent().build();
    }
}