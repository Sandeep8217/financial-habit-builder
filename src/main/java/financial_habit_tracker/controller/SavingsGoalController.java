
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.SavingsGoal;
import financial_habit_tracker.service.SavingsGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    @GetMapping
    public List<SavingsGoal> getAllGoals() {
        return savingsGoalService.getAllGoals();
    }

    @PostMapping
    public SavingsGoal createGoal(@RequestBody SavingsGoal goal) {
        return savingsGoalService.createGoal(goal);
    }

    @PostMapping("/{id}/contributions")
    public SavingsGoal addContribution(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> request) {

        return savingsGoalService.addContribution(
                id, request.get("amount"));
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        savingsGoalService.deleteGoal(id);
    }
}
