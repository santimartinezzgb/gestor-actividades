package com.backend.gestorActividades.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.util.ValidationUtil;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    // LISTAR TODAS LAS ACTIVIDADES (FILTRA LAS EXPIRADAS > 24H)
    public List<Activity> getActivities() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        return activityRepository.findAll().stream()
                .filter(a -> a.getDate() == null || a.getDate().isAfter(cutoff))
                .toList();
    }

    public Activity saveActivity(Activity activity) {
        // Validar campos básicos
        ValidationUtil.validateStringNotEmpty(activity.getName(), "Activity name");
        ValidationUtil.validateStringNotEmpty(activity.getDescription(), "Descripción");

        // Validar la regla de 24 horas de antelación
        ValidationUtil.validateActivityDate(activity.getDate());

        return activityRepository.save(activity);
    }

    public Activity updateActivity(String id, Activity activityDetails) {
        return activityRepository.findById(id).map(a -> {

            if (activityDetails.getDate() != null && !activityDetails.getDate().equals(a.getDate())) {

                ValidationUtil.validateActivityDate(activityDetails.getDate());
                a.setDate(activityDetails.getDate());
            }

            a.setName(activityDetails.getName());
            a.setDescription(activityDetails.getDescription());
            a.setCapacity(activityDetails.getCapacity());
            a.setActive(activityDetails.isActive());

            return activityRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Activity with ID " + id + " not found"));
    }

    public boolean deleteActivity(String id) {

        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}