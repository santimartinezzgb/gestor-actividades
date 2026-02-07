package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.repositories.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    // ACTIVITY REPOSITORY TO INTERACT WITH THE DATABASE
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
                // IF THE ACTIVITY WAS NOT FOUND, THROW AN EXCEPTION
                .orElseThrow(() -> new RuntimeException("Actividad con ID " + id + " no encontrada"));
    }

    // ADD NEW ACTIVITY
    public Activity addActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    // UPDATE ACTIVITY BY ID
    public Activity updateActivity(String id, Activity activityDetails) {
        return activityRepository.findById(id).map(existingActivity -> {
            existingActivity.setName(activityDetails.getName()); // SET NAME
            existingActivity.setDescription(activityDetails.getDescription()); // SET DESCRIPTION
            existingActivity.setDate(activityDetails.getDate()); // SET DATE
            existingActivity.setCapacity(activityDetails.getCapacity()); // SET CAPACITY
            existingActivity.setActive(activityDetails.isActive()); // SET ACTIVE

            // SAVE THE UPDATED ACTIVITY
            return activityRepository.save(existingActivity);

            // IF THE ACTIVITY WAS NOT FOUND, THROW AN EXCEPTION
        }).orElseThrow(() -> new RuntimeException("Activity with ID " + id + " not found"));
    }

    // DELETE ACTIVITY BY ID
    public boolean deleteActivity(String id) {
        // CHECK IF THE ACTIVITY EXISTS BEFORE DELETING
        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id);
            return true; // RETURN TRUE IF DELETED SUCCESSFULLY
        }
        return false; // RETURN FALSE IF THE ACTIVITY WAS NOT FOUND
    }
}