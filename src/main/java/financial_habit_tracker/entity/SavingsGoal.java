
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
@Table(name = "savings_goals")
@Getter
@Setter
@NoArgsConstructor
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Goal name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be greater than zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal targetAmount;

    @NotNull(message = "Current savings amount is required")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;

    private LocalDate targetDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
