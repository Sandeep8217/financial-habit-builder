
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingsGoalRepository
        extends JpaRepository<SavingsGoal, Long> {
}
