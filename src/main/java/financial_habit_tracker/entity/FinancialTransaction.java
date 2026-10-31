
package financial_habit_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
public class FinancialTransaction {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 100)
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Transaction date is required")
    @Column(nullable = false)
    private LocalDate transactionDate;

    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private CategoryType type;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
