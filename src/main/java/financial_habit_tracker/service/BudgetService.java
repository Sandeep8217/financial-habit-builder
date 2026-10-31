
package financial_habit_tracker.service;

import financial_habit_tracker.dto.BudgetSummary;
import financial_habit_tracker.entity.Budget;
import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.BudgetRepository;
import financial_habit_tracker.repository.CategoryRepository;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final FinancialTransactionRepository transactionRepository;
    private final CurrentUserService currentUserService;

    public List<Budget> getBudgets(int year, int month) {
        validateMonth(year, month);

        Long userId = currentUserService.getCurrentUserId();

        return budgetRepository.findByUserIdAndYearAndMonth(
                userId, year, month
        );
    }

    @Transactional
    public Budget createBudget(Budget budget) {
        validateMonth(budget.getYear(), budget.getMonth());
        validateAmount(budget.getAmount());

        User currentUser = currentUserService.getCurrentUser();

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

        boolean duplicate = budgetRepository
                .existsByUserIdAndCategoryIdAndYearAndMonth(
                        currentUser.getId(),
                        category.getId(),
                        budget.getYear(),
                        budget.getMonth()
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "A budget already exists for this category and month");
        }

        budget.setCategory(category);
        budget.setUser(currentUser);

        return budgetRepository.save(budget);
    }

    public List<BudgetSummary> getBudgetSummaries(int year, int month) {
        validateMonth(year, month);

        Long userId = currentUserService.getCurrentUserId();

        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = YearMonth.of(year, month)
                .plusMonths(1)
                .atDay(1);

        return budgetRepository
                .findByUserIdAndYearAndMonth(userId, year, month)
                .stream()
                .map(budget -> {
                    BigDecimal spent =
                            transactionRepository.getCategorySpending(
                                    budget.getCategory().getId(),
                                    CategoryType.EXPENSE,
                                    startDate,
                                    endDate,
                                    userId
                            );

                    if (spent == null) {
                        spent = BigDecimal.ZERO;
                    }

                    BigDecimal remaining =
                            budget.getAmount().subtract(spent);

                    BigDecimal percentage = spent
                            .multiply(BigDecimal.valueOf(100))
                            .divide(
                                    budget.getAmount(),
                                    2,
                                    java.math.RoundingMode.HALF_UP
                            );

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

    private void validateMonth(int year, int month) {
        if (year < 2000 || year > 2100 || month < 1 || month > 12) {
            throw new IllegalArgumentException(
                    "Invalid budget year or month");
        }
    }
    @Transactional
    public Budget updateBudget(Long id, Budget updatedBudget) {
        Long userId = currentUserService.getCurrentUserId();

        Budget existing = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Budget not found"));

        validateMonth(updatedBudget.getYear(), updatedBudget.getMonth());
        validateAmount(updatedBudget.getAmount());

        if (updatedBudget.getCategory() == null
                || updatedBudget.getCategory().getId() == null) {
            throw new IllegalArgumentException("A category is required");
        }

        Category category = categoryRepository
                .findById(updatedBudget.getCategory().getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found"));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new IllegalArgumentException(
                    "Budgets can only use expense categories");
        }

        boolean duplicate = budgetRepository
                .existsByUserIdAndCategoryIdAndYearAndMonth(
                        userId,
                        category.getId(),
                        updatedBudget.getYear(),
                        updatedBudget.getMonth()
                );

        if (duplicate && (
                !existing.getCategory().getId().equals(category.getId())
                        || existing.getYear() != updatedBudget.getYear()
                        || existing.getMonth() != updatedBudget.getMonth()
        )) {
            throw new IllegalArgumentException(
                    "A budget already exists for this category and month");
        }

        existing.setCategory(category);
        existing.setAmount(updatedBudget.getAmount());
        existing.setYear(updatedBudget.getYear());
        existing.setMonth(updatedBudget.getMonth());

        return budgetRepository.save(existing);
    }

    @Transactional
    public void deleteBudget(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Budget not found"));

        budgetRepository.delete(budget);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Budget amount must be greater than zero"
            );
        }
    }
}
