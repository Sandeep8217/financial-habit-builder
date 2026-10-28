
package financial_habit_tracker.service;

import financial_habit_tracker.dto.MonthlyCashFlow;
import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinancialTransactionRepository transactionRepository;

    public Map<String, Object> getMonthlySummary(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.plusMonths(1).atDay(1);

        BigDecimal income = transactionRepository
                .getTotalByTypeAndDateRange(
                        CategoryType.INCOME, startDate, endDate);

        BigDecimal expenses = transactionRepository
                .getTotalByTypeAndDateRange(
                        CategoryType.EXPENSE, startDate, endDate);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("month", month.toString());
        summary.put("income", income);
        summary.put("expenses", expenses);
        summary.put("savings", income.subtract(expenses));

        return summary;
    }

    public List<MonthlyCashFlow> getLastSixMonthsCashFlow() {
        YearMonth currentMonth = YearMonth.now();

        List<MonthlyCashFlow> results = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);

            LocalDate startDate = month.atDay(1);
            LocalDate endDate = month.plusMonths(1).atDay(1);

            BigDecimal income = transactionRepository.getTotalByTypeAndDateRange(
                    CategoryType.INCOME,
                    startDate,
                    endDate
            );

            BigDecimal expenses = transactionRepository.getTotalByTypeAndDateRange(
                    CategoryType.EXPENSE,
                    startDate,
                    endDate
            );

            results.add(
                    new MonthlyCashFlow(
                            month.getMonth().getDisplayName(
                                    java.time.format.TextStyle.SHORT,
                                    java.util.Locale.ENGLISH
                            ),
                            income,
                            expenses
                    )
            );
        }

        return results;
    }

}
