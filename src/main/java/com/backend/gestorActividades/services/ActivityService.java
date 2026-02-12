package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.util.ValidationUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    // LIST ALL ACTIVITIES
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    // GET ACTIVITY BY ID
    public Activity getActivityById(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actividad con ID " + id + " no encontrada"));
    }

    // SAVE ACTIVITY
    public Activity saveActivity(Activity activity) {
        // Validate basic fields
        ValidationUtil.validateStringNotEmpty(activity.getName(), "Activity name");
        ValidationUtil.validateStringNotEmpty(activity.getDescription(), "Descripción");

        // Validate the 24-hour advance rule
        ValidationUtil.validateActivityDate(activity.getDate());

        return activityRepository.save(activity);
    }

    // UPDATE ACTIVITY BY ID
    public Activity updateActivity(String id, Activity activityDetails) {
        return activityRepository.findById(id).map(existingActivity -> {
            // Si la fecha ha cambiado, validamos que la nueva fecha cumpla las 24h
            if (activityDetails.getDate() != null && !activityDetails.getDate().equals(existingActivity.getDate())) {
                ValidationUtil.validateActivityDate(activityDetails.getDate());
                existingActivity.setDate(activityDetails.getDate());
            }

            existingActivity.setName(activityDetails.getName());
            existingActivity.setDescription(activityDetails.getDescription());
            existingActivity.setCapacity(activityDetails.getCapacity());
            existingActivity.setActive(activityDetails.isActive());

            return activityRepository.save(existingActivity);
        }).orElseThrow(() -> new RuntimeException("Activity with ID " + id + " not found"));
    }

    // DELETE ACTIVITY BY ID
    public boolean deleteActivity(String id) {
        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}