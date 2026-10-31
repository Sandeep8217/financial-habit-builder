
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.repository.AssetRepository;
import financial_habit_tracker.repository.LiabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WealthService {

    private final AssetRepository assetRepository;
    private final LiabilityRepository liabilityRepository;
    private final CurrentUserService currentUserService;

    public List<Asset> getAssets() {
        Long userId = currentUserService.getCurrentUserId();
        return assetRepository.findAllByUserId(userId);
    }

    public List<Liability> getLiabilities() {
        Long userId = currentUserService.getCurrentUserId();
        return liabilityRepository.findAllByUserId(userId);
    }

    public Map<String, BigDecimal> getNetWorth() {
        Long userId = currentUserService.getCurrentUserId();

        BigDecimal totalAssets = assetRepository.findAllByUserId(userId)
                .stream()
                .map(Asset::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLiabilities =
                liabilityRepository.findAllByUserId(userId)
                        .stream()
                        .map(Liability::getOutstandingAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> result = new LinkedHashMap<>();
        result.put("totalAssets", totalAssets);
        result.put("totalLiabilities", totalLiabilities);
        result.put("netWorth", totalAssets.subtract(totalLiabilities));

        return result;
    }
}
