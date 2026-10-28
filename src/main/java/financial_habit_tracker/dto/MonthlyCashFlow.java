
package financial_habit_tracker.dto;

import java.math.BigDecimal;

public record MonthlyCashFlow(
        String month,
        BigDecimal income,
        BigDecimal expenses
) {}
