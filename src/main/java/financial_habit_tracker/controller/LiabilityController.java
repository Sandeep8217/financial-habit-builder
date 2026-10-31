
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.service.LiabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wealth/liabilities")
@RequiredArgsConstructor
public class LiabilityController {

    private final LiabilityService liabilityService;

    @GetMapping
    public List<Liability> getAllLiabilities() {
        return liabilityService.getAllLiabilities();
    }

    @PostMapping
    public Liability createLiability(
            @Valid @RequestBody Liability liability) {
        return liabilityService.createLiability(liability);
    }

    @PutMapping("/{id}")
    public Liability updateLiability(
            @PathVariable Long id,
            @Valid @RequestBody Liability liability) {
        return liabilityService.updateLiability(id, liability);
    }

    @DeleteMapping("/{id}")
    public void deleteLiability(@PathVariable Long id) {
        liabilityService.deleteLiability(id);
    }
}
