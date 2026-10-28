
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.service.WealthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wealth")
@RequiredArgsConstructor
public class WealthController {

    private final WealthService wealthService;

    @GetMapping("/assets")
    public List<Asset> getAssets() {
        return wealthService.getAssets();
    }

    @PostMapping("/assets")
    public Asset createAsset(@Valid @RequestBody Asset asset) {
        return wealthService.createAsset(asset);
    }

    @DeleteMapping("/assets/{id}")
    public void deleteAsset(@PathVariable Long id) {
        wealthService.deleteAsset(id);
    }

    @GetMapping("/liabilities")
    public List<Liability> getLiabilities() {
        return wealthService.getLiabilities();
    }

    @PostMapping("/liabilities")
    public Liability createLiability(
            @Valid @RequestBody Liability liability) {
        return wealthService.createLiability(liability);
    }

    @DeleteMapping("/liabilities/{id}")
    public void deleteLiability(@PathVariable Long id) {
        wealthService.deleteLiability(id);
    }

    @GetMapping("/summary")
    public Map<String, BigDecimal> getNetWorth() {
        return wealthService.getNetWorth();
    }
}
