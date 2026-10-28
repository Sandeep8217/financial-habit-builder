
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.FinancialTransaction;
import financial_habit_tracker.repository.CategoryRepository;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialTransactionService {

    private final FinancialTransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public List<FinancialTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public FinancialTransaction createTransaction(
            FinancialTransaction transaction) {

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

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Transaction not found");
        }

        transactionRepository.deleteById(id);
    }

    public FinancialTransaction updateTransaction(
            Long id, FinancialTransaction updatedTransaction) {

        FinancialTransaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Transaction not found"));

        if (updatedTransaction.getCategory() == null
                || updatedTransaction.getCategory().getId() == null) {
            throw new IllegalArgumentException("A valid category is required");
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
        existing.setTransactionDate(updatedTransaction.getTransactionDate());
        existing.setType(updatedTransaction.getType());
        existing.setCategory(category);

        return transactionRepository.save(existing);
    }

}
