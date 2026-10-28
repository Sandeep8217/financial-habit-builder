
package financial_habit_tracker.controller;

import financial_habit_tracker.dto.BudgetSummary;
import financial_habit_tracker.entity.Budget;
import financial_habit_tracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public List<Budget> getBudgets(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        YearMonth current = YearMonth.now();

        return budgetService.getBudgets(
                year == null ? current.getYear() : year,
                month == null ? current.getMonthValue() : month
        );
    }

    @PostMapping
    public Budget createBudget(@Valid @RequestBody Budget budget) {
        return budgetService.createBudget(budget);
    }

    @GetMapping("/summary")
    public List<BudgetSummary> getBudgetSummaries(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        YearMonth current = YearMonth.now();

        return budgetService.getBudgetSummaries(
                year == null ? current.getYear() : year,
                month == null ? current.getMonthValue() : month
        );
    }
}
