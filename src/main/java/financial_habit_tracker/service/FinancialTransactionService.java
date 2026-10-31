
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.FinancialTransaction;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.CategoryRepository;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinancialTransactionService {

    private final FinancialTransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public List<FinancialTransaction> getAllTransactions() {
        Long userId = currentUserService.getCurrentUserId();
        return transactionRepository.findAllByUserId(userId);
    }

    @Transactional
    public FinancialTransaction createTransaction(
            FinancialTransaction transaction) {

        User currentUser = currentUserService.getCurrentUser();

        if (transaction.getCategory() == null
                || transaction.getCategory().getId() == null) {
            throw new IllegalArgumentException(
                    "A valid category is required");
        }

        Category category = categoryRepository
                .findById(transaction.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category not found"));

        if (category.getType() != transaction.getType()) {
            throw new IllegalArgumentException(
                    "Transaction type must match category type");
        }

        transaction.setCategory(category);
        transaction.setUser(currentUser);
        validateTransaction(transaction);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        FinancialTransaction transaction =
                transactionRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Transaction not found"));

        transactionRepository.delete(transaction);
    }

    @Transactional
    public FinancialTransaction updateTransaction(
            Long id, FinancialTransaction updatedTransaction) {

        Long userId = currentUserService.getCurrentUserId();

        FinancialTransaction existing =
                transactionRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Transaction not found"));

        if (updatedTransaction.getCategory() == null
                || updatedTransaction.getCategory().getId() == null) {
            throw new IllegalArgumentException(
                    "A valid category is required");
        }

        Category category = categoryRepository
                .findById(updatedTransaction.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category not found"));

        if (category.getType() != updatedTransaction.getType()) {
            throw new IllegalArgumentException(
                    "Transaction type must match category type");
        }

        existing.setDescription(updatedTransaction.getDescription());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setTransactionDate(
                updatedTransaction.getTransactionDate());
        existing.setType(updatedTransaction.getType());
        existing.setCategory(category);
        validateTransaction(updatedTransaction);

        return transactionRepository.save(existing);
    }


    private void validateTransaction(FinancialTransaction transaction) {
        if (transaction.getAmount() == null
                || transaction.getAmount().signum() <= 0) {
            throw new IllegalArgumentException(
                    "Transaction amount must be greater than zero");
        }

        if (transaction.getTransactionDate() == null) {
            throw new IllegalArgumentException(
                    "Transaction date is required");
        }

        if (transaction.getType() == null) {
            throw new IllegalArgumentException(
                    "Transaction type is required");
        }

        if (transaction.getDescription() == null
                || transaction.getDescription().isBlank()) {
            throw new IllegalArgumentException(
                    "Transaction description is required");
        }
    }

}
