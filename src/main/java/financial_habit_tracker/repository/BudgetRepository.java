
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByYearAndMonth(int year, int month);
}
