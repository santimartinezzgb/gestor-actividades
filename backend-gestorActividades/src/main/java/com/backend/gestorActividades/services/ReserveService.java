package com.backend.gestorActividades.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.gestorActividades.models.Activity;
import com.backend.gestorActividades.models.Reserve;
import com.backend.gestorActividades.models.User;
import com.backend.gestorActividades.models.enums.ReserveState;
import com.backend.gestorActividades.repositories.ActivityRepository;
import com.backend.gestorActividades.repositories.ReserveRepository;
import com.backend.gestorActividades.repositories.UserRepository;

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

    public Reserve createReserve(Reserve reserve) {
        validatePresence(reserve);

        Activity activity = activityRepository.findById(reserve.getActivity().getId())
                .orElseThrow(
                        () -> new RuntimeException("Activity not found with ID: " + reserve.getActivity().getId()));

        User user = userRepository.findById(reserve.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + reserve.getUser().getId()));

        checkTimingConstraint(activity);
        checkDuplicateReserve(user.getId(), activity.getId());
        checkCapacity(activity);

        reserve.setActivity(activity);
        reserve.setUser(user);
        reserve.setReservedAt(LocalDateTime.now());
        reserve.setState(ReserveState.CONFIRMED);

        activity.setReservedCount(activity.getReservedCount() + 1);
        activityRepository.save(activity);

        return reserveRepository.save(reserve);
    }

    public Reserve cancelReserve(String id) {

        return reserveRepository.findById(id)
                .map(reserve -> {

                    if (reserve.getState() == ReserveState.CONFIRMED) {
                        try {
                            Activity activity = reserve.getActivity();
                            if (activity != null && activity.getDate() != null) {
                                // SOLO LIBERAR PLAZA SI ES CON > 15 MINS DE ANTELACIÓN
                                long minutesToStart = Duration.between(LocalDateTime.now(), activity.getDate())
                                        .toMinutes();
                                if (minutesToStart > 15) {
                                    activity.setReservedCount(Math.max(0, activity.getReservedCount() - 1));
                                    activityRepository.save(activity);
                                }
                            }
                        } catch (Exception e) {
                        }
                    }

                    reserve.setState(ReserveState.CANCELED);
                    return reserveRepository.save(reserve);
                })
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    public Reserve updateReserve(String id, Reserve reserve) {
        return reserveRepository.findById(id)
                .map(reserveUpdated -> {

                    if (!reserveUpdated.getActivity().getId().equals(reserve.getActivity().getId())) {

                        Activity newActivity = activityRepository.findById(reserve.getActivity().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "New activity not found with ID: " + reserve.getActivity().getId()));

                        checkCapacity(newActivity);

                        if (reserveUpdated.getState() == ReserveState.CONFIRMED) {
                            Activity oldActivity = reserveUpdated.getActivity();
                            oldActivity.setReservedCount(Math.max(0, oldActivity.getReservedCount() - 1));
                            activityRepository.save(oldActivity);

                            newActivity.setReservedCount(newActivity.getReservedCount() + 1);
                            activityRepository.save(newActivity);
                        }

                        reserveUpdated.setActivity(newActivity);
                    }

                    if (reserve.getUser() != null && reserve.getUser().getId() != null) {
                        User user = userRepository.findById(reserve.getUser().getId())
                                .orElseThrow(() -> new RuntimeException(
                                        "User not found with ID: " + reserve.getUser().getId()));
                        reserveUpdated.setUser(user);
                    }

                    return reserveRepository.save(reserveUpdated);
                })
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));
    }

    public void deleteReserve(String id) {

        Reserve reserve = reserveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserve not found with ID: " + id));

        if (reserve.getState() == ReserveState.CONFIRMED) {
            Activity activity = reserve.getActivity();
            activity.setReservedCount(Math.max(0, activity.getReservedCount() - 1));
            activityRepository.save(activity);
        }

        reserveRepository.deleteById(id);
    }

    private void validatePresence(Reserve reserve) {
        if (reserve.getActivity() == null || reserve.getUser() == null) {
            throw new IllegalArgumentException("The user and activity must be provided for a reservation");
        }
    }

    private void checkTimingConstraint(Activity activity) {
        if (Duration.between(LocalDateTime.now(), activity.getDate()).toMinutes() <= 15) {
            throw new IllegalStateException("The reserves must be made at least 15 mins before the activity starts.");
        }
    }

    private void checkDuplicateReserve(String userId, String activityId) {
        if (reserveRepository.existsByUserIdAndActivityIdAndState(userId, activityId, ReserveState.CONFIRMED)) {
            throw new IllegalStateException("The user already has a confirmed reservation for this activity.");
        }
    }

    private void checkCapacity(Activity activity) {
        if (activity.getReservedCount() >= activity.getCapacity()) {
            throw new IllegalStateException("Sorry, the activity has reached its maximum capacity.");
        }
    }
}