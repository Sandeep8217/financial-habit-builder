
package financial_habit_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "habits")
@Getter
@Setter
@NoArgsConstructor
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Habit name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 250)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private int totalXp = 0;

    private LocalDate lastCompletedDate;

    @Column(nullable = false)
    private int currentStreak = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
