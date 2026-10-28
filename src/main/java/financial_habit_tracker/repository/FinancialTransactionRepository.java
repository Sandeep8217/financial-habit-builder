
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.entity.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FinancialTransactionRepository
        extends JpaRepository<FinancialTransaction, Long> {


    @Query("""
    SELECT COALESCE(SUM(t.amount), 0)
    FROM FinancialTransaction t
    WHERE t.type = :type
      AND t.transactionDate >= :startDate
      AND t.transactionDate < :endDate
    """)
    BigDecimal getTotalByTypeAndDateRange(
            @Param("type") CategoryType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<FinancialTransaction> findByTransactionDateBetween(
            LocalDate startDate, LocalDate endDate);


    @Query("""
    SELECT COALESCE(SUM(t.amount), 0)
    FROM FinancialTransaction t
    WHERE t.category.id = :categoryId
      AND t.type = financial_habit_tracker.entity.CategoryType.EXPENSE
      AND t.transactionDate >= :startDate
      AND t.transactionDate < :endDate
    """)
    BigDecimal getCategorySpending(
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);


}
