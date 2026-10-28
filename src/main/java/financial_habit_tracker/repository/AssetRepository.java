
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}
