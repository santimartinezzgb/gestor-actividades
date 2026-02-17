package com.backend.gestorActividades.services;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.ReserveState;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.repositories.ReserveRepository;
import com.backend.gestorActividades.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReserveService {

    private final ReserveRepository reserveRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ReserveService(ReserveRepository reserveRepository, ActivityRepository activityRepository,
            UserRepository userRepository) {
        this.reserveRepository = reserveRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public List<Reserve> getReserves() {
        return reserveRepository.findAll();
    }

    public Reserve getReserveById(String id) {
        return reserveRepository.findById(id).orElse(null);
    }

    // CREAR RESERVA
    public Reserve createReserve(Reserve reserve) {
        validatePresence(reserve);

        Activity activity = activityRepository.findById(reserve.getActivity().getId())
                .orElseThrow(
                        () -> new RuntimeException("Activity not found with ID: " + reserve.getActivity().getId()));

        User user = userRepository.findById(reserve.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + reserve.getUser().getId()));

        // VALIDACIONES ( TIEMPO, DUPLICADOS, CAPACIDAD )
        checkTimingConstraint(activity);
        checkDuplicateReserve(user.getId(), activity.getId());
        checkCapacity(activity);

        // CREAR LA RESERVA
        reserve.setActivity(activity);
        reserve.setUser(user);
        reserve.setReservedAt(LocalDateTime.now());
        reserve.setState(ReserveState.CONFIRMED); // ASEGURAR QUE EL ESTADO INICIAL ES CONFIRMADO

        // INCREMENTAR EL CONTADOR DE RESERVAS
        activity.setReservedCount(activity.getReservedCount() + 1);
        activityRepository.save(activity);

        return reserveRepository.save(reserve);
    }

    // CANCELAR RESERVA
    public Reserve cancelReserve(String id) {

        // OBTENER LA RESERVA POR ID
        return reserveRepository.findById(id)
                .map(reserve -> {

                    if (reserve.getState() == ReserveState.CONFIRMED) { // LIBERA SI ESTÁ CONFIRMADA
                        Activity activity = reserve.getActivity();

                        // SOLO LIBERAR PLAZA SI ES CON > 15 MINS DE ANTELACIÓN
                        long minutesToStart = Duration.between(LocalDateTime.now(), activity.getDate()).toMinutes();
                        if (minutesToStart > 15) {
                            activity.setReservedCount(Math.max(0, activity.getReservedCount() - 1));
                            activityRepository.save(activity);
                        }
                    }

                    reserve.setState(ReserveState.CANCELED); // ACTUALIZAR EL ESTADO A CANCELADO
                    return reserveRepository.save(reserve); // GUARDAR LOS CAMBIOS EN LA BASE DE DATOS
                })
                // SI NO SE ENCUENTRA LA RESERVA, LANZAR UNA EXCEPCIÓN
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    // ACTUALIZAR RESERVA
    public Reserve updateReserve(String id, Reserve reserve) {
        return reserveRepository.findById(id)
                .map(reserveUpdated -> {

                    if (!reserveUpdated.getActivity().getId().equals(reserve.getActivity().getId())) {

                        // NUEVA ACTIVIDAD PARA ACTUALIZAR
                        Activity newActivity = activityRepository.findById(reserve.getActivity().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "New activity not found with ID: " + reserve.getActivity().getId()));

                        checkCapacity(newActivity); // VALIDAR LA CAPACIDAD DE LA NUEVA ACTIVIDAD

                        // ACTUALIZAR LOS CONTADORES DE RESERVAS SOLO SI LA RESERVA ESTÁ CONFIRMADA
                        if (reserveUpdated.getState() == ReserveState.CONFIRMED) {
                            // LIBERAR PLAZA DE LA ACTIVIDAD ANTIGUA
                            Activity oldActivity = reserveUpdated.getActivity();
                            oldActivity.setReservedCount(Math.max(0, oldActivity.getReservedCount() - 1));
                            activityRepository.save(oldActivity);

                            newActivity.setReservedCount(newActivity.getReservedCount() + 1);
                            activityRepository.save(newActivity);
                        }

                        reserveUpdated.setActivity(newActivity); // ACTUALIZAR LA ACTIVIDAD EN LA RESERVA
                    }

                    if (reserve.getUser() != null && reserve.getUser().getId() != null) {
                        // NUEVO USUARIO PARA ACTUALIZAR
                        User user = userRepository.findById(reserve.getUser().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "User not found with ID: " + reserve.getUser().getId()));
                        reserveUpdated.setUser(user);
                    }

                    return reserveRepository.save(reserveUpdated); // GUARDAR LOS CAMBIOS EN LA BASE DE DATOS
                })
                // SI NO SE ENCUENTRA LA RESERVA, LANZAR UNA EXCEPCIÓN
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    // ELIMINAR RESERVA
    public void deleteReserve(String id) {

        // OBTENER LA RESERVA POR ID
        Reserve reserve = reserveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));

        if (reserve.getState() == ReserveState.CONFIRMED) {
            // LIBERAR LA PLAZA EN LA ACTIVIDAD
            Activity activity = reserve.getActivity();
            activity.setReservedCount(Math.max(0, activity.getReservedCount() - 1));
            activityRepository.save(activity);
        }

        reserveRepository.deleteById(id); // ELIMINAR LA RESERVA DE LA BASE DE DATOS
    }

    /**
     * VALIDACIONES DE TIEMPO, DUPLICADOS Y CAPACIDAD PARA CREAR O ACTUALIZAR RESERVAS
     */

    // VERIFICAR PRESENCIA DE USUARIO Y ACTIVIDAD
    private void validatePresence(Reserve reserve) {
        if (reserve.getActivity() == null || reserve.getUser() == null) {
            throw new IllegalArgumentException("The user and activity must be provided for a reservation");
        }
    }

    // COMPROBAR SI LA RESERVA SE HACE CON AL MENOS 15 MINUTOS DE ANTELACIÓN
    private void checkTimingConstraint(Activity activity) {
        if (Duration.between(LocalDateTime.now(), activity.getDate()).toMinutes() <= 15) {
            throw new IllegalStateException("The reserves must be made at least 15 mins before the activity starts.");
        }
    }

    // COMPROBAR SI EL USUARIO YA TIENE UNA RESERVA CONFIRMADA PARA LA MISMA ACTIVIDAD
    private void checkDuplicateReserve(String userId, String activityId) {
        // SOLO ES DUPLICADA SI HAY UNA RESERVA ACTIVA
        if (reserveRepository.existsByUserIdAndActivityIdAndState(userId, activityId, ReserveState.CONFIRMED)) {
            throw new IllegalStateException("The user already has a confirmed reservation for this activity.");
        }
    }

    // COMPROBAR SI LA ACTIVIDAD TIENE CAPACIDAD DISPONIBLE
    private void checkCapacity(Activity activity) {
        if (activity.getReservedCount() >= activity.getCapacity()) {
            throw new IllegalStateException("Sorry, the activity has reached its maximum capacity.");
        }
    }
}