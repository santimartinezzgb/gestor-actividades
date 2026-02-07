package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.services.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities") // Mantenemos consistencia sin versión
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAll() {
        return ResponseEntity.ok(activityService.getActivities());
    }
}