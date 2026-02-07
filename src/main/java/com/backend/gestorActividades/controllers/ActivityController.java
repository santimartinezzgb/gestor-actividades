package com.backend.gestorActividades.controllers;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.services.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    // SERVICE TO HANDLE EACH ACTIVITY
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping // ENDPOINT TO GET ALL ACTIVITIES
    public ResponseEntity<List<Activity>> getAll() {
        return ResponseEntity.ok(activityService.getActivities());
    }


    /**
     * ONLY ADMIN CAN USE THESE ENDPOINTS
     */

    @PostMapping("/addActivity") // ENDPOINT TO ADD AN ACTIVITY
    public ResponseEntity<Activity> addActivity(@RequestBody Activity activity) {
        // OK IF IT WAS CREATED SUCCESSFULLY
        return ResponseEntity.ok(activityService.addActivity(activity));
    }

    @PutMapping("/{id}") // UPDATE ACTIVITY BY ID
    public ResponseEntity<Activity> updateActivity(@PathVariable String id, @RequestBody Activity activity) {
        // INSTANCE OF THE UPDATED ACTIVITY
        Activity updated = activityService.updateActivity(id, activity);

        if (updated == null) {// 404 IF THE ACTIVITY WAS NOT FOUND
            return ResponseEntity.notFound().build();
        }
        // OK IF IT WAS UPDATED SUCCESSFULLY
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}") // DELETE ACTIVITY BY ID
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        // INSTANCE OF THE DELETED ACTIVITY
        boolean deleted = activityService.deleteActivity(id);

        // 404 IF THE ACTIVITY WAS NOT FOUND
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        // NO CONTENT IF IT WAS DELETED SUCCESSFULLY
        return ResponseEntity.noContent().build();
    }
}