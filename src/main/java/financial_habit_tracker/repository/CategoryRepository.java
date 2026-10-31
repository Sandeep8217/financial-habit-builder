
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCaseAndType(String name, CategoryType type);
}
