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

    // LISTAR TODAS LAS ACTIVIDADES
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    // GUARDAR ACTIVIDAD
    public Activity saveActivity(Activity activity) {
        // Validar campos básicos
        ValidationUtil.validateStringNotEmpty(activity.getName(), "Activity name");
        ValidationUtil.validateStringNotEmpty(activity.getDescription(), "Descripción");

        // Validar la regla de 24 horas de antelación
        ValidationUtil.validateActivityDate(activity.getDate());

        return activityRepository.save(activity);
    }

    // ACTUALIZAR ACTIVIDAD POR ID
    public Activity updateActivity(String id, Activity activityDetails) {
        return activityRepository.findById(id).map(a -> {

            // ¿HA CAMBIADO LA FECHA?
            if (activityDetails.getDate() != null && !activityDetails.getDate().equals(a.getDate())) {

                // VALIDAR NUEVA FECHA
                ValidationUtil.validateActivityDate(activityDetails.getDate());
                // ACTUALIZAR FECHA
                a.setDate(activityDetails.getDate());
            }

            // ACTUALIZAR LOS DEMÁS CAMPOS
            a.setName(activityDetails.getName());
            a.setDescription(activityDetails.getDescription());
            a.setCapacity(activityDetails.getCapacity());
            a.setActive(activityDetails.isActive());

            return activityRepository.save(a);
        }).orElseThrow(() -> new RuntimeException("Activity with ID " + id + " not found"));
    }

    // ELIMINAR ACTIVIDAD POR ID
    public boolean deleteActivity(String id) {

        // VERIFICAR SI LA ACTIVIDAD EXISTE ANTES DE ELIMINAR
        if (activityRepository.existsById(id)) {
            activityRepository.deleteById(id); // ELIMINAR ACTIVIDAD
            return true;
        }
        return false; // FALSE SI LA ACTIVIDAD NO EXISTE
    }
}