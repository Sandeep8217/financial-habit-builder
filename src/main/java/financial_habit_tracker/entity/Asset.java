
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
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Asset name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Asset value is required")
    @PositiveOrZero(message = "Asset value cannot be negative")
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal currentValue;
}
