
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.HabitCompletion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HabitCompletionRepository
        extends JpaRepository<HabitCompletion, Long> {

    boolean existsByHabitIdAndCompletionDate(
            Long habitId, LocalDate completionDate);

    List<HabitCompletion> findByHabitIdOrderByCompletionDateDesc(
            Long habitId);
}
