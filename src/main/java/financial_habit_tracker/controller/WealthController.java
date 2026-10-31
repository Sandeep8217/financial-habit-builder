
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.Asset;
import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.service.WealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wealth")
@RequiredArgsConstructor
public class WealthController {

    private final WealthService wealthService;

    @GetMapping("/summary")
    public Map<String, BigDecimal> getNetWorth() {
        return wealthService.getNetWorth();
    }
}
