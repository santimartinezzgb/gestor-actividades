package com.backend.gestorActividades.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.repositories.ReserveRepository;

/**
 * Tarea programada que elimina automáticamente las actividades
 * cuya fecha de acción sea más de 24 horas en el pasado,
 * junto con sus reservas asociadas.
 */
@Component
public class ActivityCleanupScheduler {

    private final ActivityRepository activityRepository;
    private final ReserveRepository reserveRepository;

    public ActivityCleanupScheduler(ActivityRepository activityRepository, ReserveRepository reserveRepository) {
        this.activityRepository = activityRepository;
        this.reserveRepository = reserveRepository;
    }

    @Scheduled(fixedRate = 3600000) // CADA HORA
    public void cleanupExpiredActivities() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<Activity> expiredActivities = activityRepository.findByDateBefore(cutoff);

        if (expiredActivities.isEmpty()) {
            return;
        }


        for (Activity activity : expiredActivities) {
            reserveRepository.deleteByActivity(activity);
        }

        activityRepository.deleteAll(expiredActivities);
    }
}
