
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Habit;
import financial_habit_tracker.entity.HabitCompletion;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.HabitCompletionRepository;
import financial_habit_tracker.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;
    private final CurrentUserService currentUserService;

    public List<Habit> getAllHabits() {
        Long userId = currentUserService.getCurrentUserId();
        return habitRepository.findAllByUserId(userId);
    }

    @Transactional
    public Habit createHabit(Habit habit) {
        User currentUser = currentUserService.getCurrentUser();

        habit.setId(null);
        habit.setTotalXp(0);
        habit.setCurrentStreak(0);
        habit.setLastCompletedDate(null);
        habit.setUser(currentUser);

        return habitRepository.save(habit);
    }

    @Transactional
    public Habit completeHabit(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Habit habit = habitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Habit not found"));

        if (!habit.isActive()) {
            throw new IllegalArgumentException("Habit is inactive");
        }

        LocalDate today = LocalDate.now();

        if (completionRepository.existsByHabitIdAndCompletionDate(id, today)) {
            throw new IllegalArgumentException(
                    "Habit already completed today");
        }

        LocalDate lastCompleted = habit.getLastCompletedDate();

        if (today.minusDays(1).equals(lastCompleted)) {
            habit.setCurrentStreak(habit.getCurrentStreak() + 1);
        } else if (!today.equals(lastCompleted)) {
            habit.setCurrentStreak(1);
        } else {
            throw new IllegalArgumentException(
                    "Habit already completed today");
        }

        habit.setLastCompletedDate(today);
        habit.setTotalXp(habit.getTotalXp() + 10);

        HabitCompletion completion = new HabitCompletion();
        completion.setHabit(habit);
        completion.setCompletionDate(today);
        completionRepository.save(completion);

        return habitRepository.save(habit);
    }

    public List<HabitCompletion> getCompletionHistory(Long habitId) {
        Long userId = currentUserService.getCurrentUserId();

        habitRepository.findByIdAndUserId(habitId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Habit not found"));

        return completionRepository
                .findByHabitIdOrderByCompletionDateDesc(habitId);
    }

    @Transactional
    public void deleteHabit(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Habit habit = habitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Habit not found"));

        completionRepository.deleteAll(
                completionRepository
                        .findByHabitIdOrderByCompletionDateDesc(id));

        habitRepository.delete(habit);
    }
}
