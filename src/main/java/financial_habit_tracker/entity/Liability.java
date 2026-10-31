
package financial_habit_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "liabilities")
@Getter
@Setter
@NoArgsConstructor
public class Liability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Liability name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Outstanding amount is required")
    @PositiveOrZero(message = "Outstanding amount cannot be negative")
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal outstandingAmount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
