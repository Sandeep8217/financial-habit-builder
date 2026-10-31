
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.entity.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FinancialTransactionRepository
        extends JpaRepository<FinancialTransaction, Long> {

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM FinancialTransaction t
        WHERE t.type = :type
          AND t.transactionDate >= :startDate
          AND t.transactionDate < :endDate
          AND t.user.id = :userId
        """)
    BigDecimal getTotalByTypeAndDateRange(
            @Param("type") CategoryType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("userId") Long userId
    );

    List<FinancialTransaction> findByUserIdAndTransactionDateBetween(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM FinancialTransaction t
        WHERE t.category.id = :categoryId
          AND t.type = :type
          AND t.transactionDate >= :startDate
          AND t.transactionDate < :endDate
          AND t.user.id = :userId
        """)
    BigDecimal getCategorySpending(
            @Param("categoryId") Long categoryId,
            @Param("type") CategoryType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("userId") Long userId
    );

    List<FinancialTransaction> findAllByUserId(Long userId);

    Optional<FinancialTransaction> findByIdAndUserId(
            Long id,
            Long userId
    );
}
