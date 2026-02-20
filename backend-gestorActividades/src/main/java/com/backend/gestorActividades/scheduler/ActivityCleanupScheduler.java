package com.backend.gestorActividades.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(ActivityCleanupScheduler.class);

    private final ActivityRepository activityRepository;
    private final ReserveRepository reserveRepository;

    public ActivityCleanupScheduler(ActivityRepository activityRepository, ReserveRepository reserveRepository) {
        this.activityRepository = activityRepository;
        this.reserveRepository = reserveRepository;
    }

    /**
     * Se ejecuta cada hora (3600000 ms).
     * Busca actividades cuya fecha sea anterior a hace 24 horas y las elimina,
     * eliminando también las reservas vinculadas a esas actividades.
     */
    @Scheduled(fixedRate = 3600000) // CADA HORA
    public void cleanupExpiredActivities() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        List<Activity> expiredActivities = activityRepository.findByDateBefore(cutoff);

        if (expiredActivities.isEmpty()) {
            log.info("No hay actividades expiradas para eliminar.");
            return;
        }

        log.info("Se encontraron {} actividades expiradas. Procediendo a eliminar...", expiredActivities.size());

        for (Activity activity : expiredActivities) {
            // ELIMINAR RESERVAS ASOCIADAS A LA ACTIVIDAD
            reserveRepository.deleteByActivity(activity);
            log.info("Eliminadas reservas de la actividad: {} ({})", activity.getName(), activity.getId());
        }

        // ELIMINAR LAS ACTIVIDADES EXPIRADAS
        activityRepository.deleteAll(expiredActivities);
        log.info("Eliminadas {} actividades expiradas correctamente.", expiredActivities.size());
    }
}
