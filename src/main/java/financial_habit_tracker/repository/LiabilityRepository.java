
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Liability;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiabilityRepository
        extends JpaRepository<Liability, Long> {
}
