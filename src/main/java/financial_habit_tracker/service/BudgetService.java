
package financial_habit_tracker.service;

import financial_habit_tracker.dto.BudgetSummary;
import financial_habit_tracker.entity.Budget;
import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.repository.BudgetRepository;
import financial_habit_tracker.repository.CategoryRepository;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final FinancialTransactionRepository transactionRepository;
    public List<Budget> getBudgets(int year, int month) {
        validateMonth(year, month);
        return budgetRepository.findByYearAndMonth(year, month);
    }

    public Budget createBudget(Budget budget) {
        validateMonth(budget.getYear(), budget.getMonth());

        if (budget.getCategory() == null
                || budget.getCategory().getId() == null) {
            throw new IllegalArgumentException("A category is required");
        }

        Category category = categoryRepository
                .findById(budget.getCategory().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found"));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new IllegalArgumentException(
                    "Budgets can only use expense categories");
        }

        budget.setCategory(category);
        return budgetRepository.save(budget);
    }

    private void validateMonth(int year, int month) {
        if (year < 2000 || year > 2100 || month < 1 || month > 12) {
            throw new IllegalArgumentException("Invalid budget year or month");
        }
    }

    public List<BudgetSummary> getBudgetSummaries(int year, int month) {
        validateMonth(year, month);

        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = YearMonth.of(year, month).plusMonths(1).atDay(1);

        return budgetRepository.findByYearAndMonth(year, month)
                .stream()
                .map(budget -> {
                    BigDecimal spent = transactionRepository.getCategorySpending(
                            budget.getCategory().getId(),
                            startDate,
                            endDate
                    );

                    BigDecimal remaining = budget.getAmount().subtract(spent);
                    BigDecimal percentage = spent
                            .multiply(BigDecimal.valueOf(100))
                            .divide(budget.getAmount(), 2,
                                    java.math.RoundingMode.HALF_UP);

                    return new BudgetSummary(
                            budget.getId(),
                            budget.getCategory().getName(),
                            budget.getAmount(),
                            spent,
                            remaining,
                            percentage
                    );
                })
                .toList();
    }

}
