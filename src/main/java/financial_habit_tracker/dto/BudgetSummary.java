
package financial_habit_tracker.dto;

import java.math.BigDecimal;

public record BudgetSummary(
        Long budgetId,
        String category,
        BigDecimal budgetAmount,
        BigDecimal spent,
        BigDecimal remaining,
        BigDecimal percentageUsed
) {
}
