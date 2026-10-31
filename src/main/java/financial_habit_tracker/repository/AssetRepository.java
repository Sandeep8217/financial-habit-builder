
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findAllByUserId(Long userId);

    Optional<Asset> findByIdAndUserId(Long id, Long userId);
}
