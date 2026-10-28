
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.repository.AssetRepository;
import financial_habit_tracker.repository.LiabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WealthService {

    private final AssetRepository assetRepository;
    private final LiabilityRepository liabilityRepository;

    public List<Asset> getAssets() {
        return assetRepository.findAll();
    }

    public Asset createAsset(Asset asset) {
        asset.setId(null);
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    public List<Liability> getLiabilities() {
        return liabilityRepository.findAll();
    }

    public Liability createLiability(Liability liability) {
        liability.setId(null);
        return liabilityRepository.save(liability);
    }

    public void deleteLiability(Long id) {
        liabilityRepository.deleteById(id);
    }

    public Map<String, BigDecimal> getNetWorth() {
        BigDecimal totalAssets = assetRepository.findAll()
                .stream()
                .map(Asset::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalLiabilities = liabilityRepository.findAll()
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
