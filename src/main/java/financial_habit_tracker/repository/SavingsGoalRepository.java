
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SavingsGoalRepository
        extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findAllByUserId(Long userId);

    Optional<SavingsGoal> findByIdAndUserId(Long id, Long userId);

    @Query("""
    SELECT COUNT(g)
    FROM SavingsGoal g
    WHERE g.currentAmount >= g.targetAmount
    """)
    long countCompletedGoals();
}
