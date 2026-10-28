
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.FinancialTransaction;
import financial_habit_tracker.service.FinancialTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class FinancialTransactionController {

    private final FinancialTransactionService transactionService;

    @GetMapping
    public List<FinancialTransaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @PostMapping
    public FinancialTransaction createTransaction(
            @Valid @RequestBody FinancialTransaction transaction) {
        return transactionService.createTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }


    @PutMapping("/{id}")
    public FinancialTransaction updateTransaction(
            @PathVariable Long id,
            @RequestBody FinancialTransaction transaction) {
        return transactionService.updateTransaction(id, transaction);
    }

}
