
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

    private final AssetRepository assetRepository;
    private final CurrentUserService currentUserService;

    public List<Asset> getAllAssets() {
        Long userId = currentUserService.getCurrentUserId();
        return assetRepository.findAllByUserId(userId);
    }

    @Transactional
    public Asset createAsset(Asset asset) {
        User currentUser = currentUserService.getCurrentUser();

        asset.setId(null);
        asset.setUser(currentUser);

        return assetRepository.save(asset);
    }

    @Transactional
    public Asset updateAsset(Long id, Asset updatedAsset) {
        Long userId = currentUserService.getCurrentUserId();

        Asset existing = assetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Asset not found"));

        existing.setName(updatedAsset.getName());
        existing.setCurrentValue(updatedAsset.getCurrentValue());

        return assetRepository.save(existing);
    }

    @Transactional
    public void deleteAsset(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Asset asset = assetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Asset not found"));

        assetRepository.delete(asset);
    }
}
