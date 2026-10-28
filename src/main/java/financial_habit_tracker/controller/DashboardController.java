
package financial_habit_tracker.controller;

import financial_habit_tracker.dto.MonthlyCashFlow;
import financial_habit_tracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/monthly")
    public Map<String, Object> getMonthlySummary(
            @RequestParam(required = false) String month) {

        YearMonth selectedMonth;

        try {
            selectedMonth = (month == null || month.isBlank())
                    ? YearMonth.now()
                    : YearMonth.parse(month);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(
                    "Month must use YYYY-MM format");
        }

        return dashboardService.getMonthlySummary(selectedMonth);
    }

    @GetMapping("/cash-flow")
    public List<MonthlyCashFlow> getLastSixMonthsCashFlow() {
        return dashboardService.getLastSixMonthsCashFlow();
    }

}
