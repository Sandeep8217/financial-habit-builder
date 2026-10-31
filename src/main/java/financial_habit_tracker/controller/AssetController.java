
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wealth/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets();
    }

    @PostMapping
    public Asset createAsset(@Valid @RequestBody Asset asset) {
        return assetService.createAsset(asset);
    }

    @PutMapping("/{id}")
    public Asset updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody Asset asset) {
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }
}
