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
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/api/activities")
    public ResponseEntity<ArrayList<Activity>> getActivities() {
        return ResponseEntity.ok(activityService.getActivities());
    }


}
