
package financial_habit_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "budgets",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_budget_user_category_period",
                columnNames = {
                        "user_id",
                        "category_id",
                        "budget_year",
                        "budget_month"
                }
        )
)
@Getter
@Setter
@NoArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull(message = "Budget amount is required")
    @Positive(message = "Budget amount must be greater than zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Min(2000)
    @Column(name = "budget_year", nullable = false)
    private int year;

    @Min(1)
    @Column(name = "budget_month", nullable = false)
    private int month;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
