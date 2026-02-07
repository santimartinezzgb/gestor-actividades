package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activities") // Mantenemos consistencia con la versión
public class ActivityController {

    private final ActivityService activityService;

    // @Autowired es opcional en constructores únicos en versiones modernas de Spring,
    // pero dejarlo o quitarlo es cuestión de estilo.
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAll() {
        // Usamos List en lugar de ArrayList para mayor flexibilidad (abstracción)
        return ResponseEntity.ok(activityService.getActivities());
    }
}