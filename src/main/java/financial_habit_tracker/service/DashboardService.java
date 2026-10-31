
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
import java.util.Locale;
import java.time.format.TextStyle;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinancialTransactionRepository transactionRepository;
    private final CurrentUserService currentUserService;

    public Map<String, Object> getMonthlySummary(YearMonth month) {
        Long userId = currentUserService.getCurrentUserId();

        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.plusMonths(1).atDay(1);

        BigDecimal income = transactionRepository.getTotalByTypeAndDateRange(
                CategoryType.INCOME, startDate, endDate, userId
        );

        BigDecimal expenses = transactionRepository.getTotalByTypeAndDateRange(
                CategoryType.EXPENSE, startDate, endDate, userId
        );

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("month", month.toString());
        summary.put("income", income);
        summary.put("expenses", expenses);
        summary.put("savings", income.subtract(expenses));

        return summary;
    }

    public List<MonthlyCashFlow> getLastSixMonthsCashFlow() {
        Long userId = currentUserService.getCurrentUserId();
        YearMonth currentMonth = YearMonth.now();

        List<MonthlyCashFlow> results = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);

            LocalDate startDate = month.atDay(1);
            LocalDate endDate = month.plusMonths(1).atDay(1);

            BigDecimal income = transactionRepository.getTotalByTypeAndDateRange(
                    CategoryType.INCOME, startDate, endDate, userId
            );

            BigDecimal expenses = transactionRepository.getTotalByTypeAndDateRange(
                    CategoryType.EXPENSE, startDate, endDate, userId
            );

            results.add(new MonthlyCashFlow(
                    month.getMonth().getDisplayName(
                            TextStyle.SHORT, Locale.ENGLISH
                    ),
                    income,
                    expenses
            ));
        }

        return results;
    }
}
