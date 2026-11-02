
package financial_habit_tracker.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(
        name = "app_users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_app_users_email",
                        columnNames = "email"
                )
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false, length = 100)
    private String name;

    @Setter
    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Setter
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Setter
    @Column(nullable = false, length = 20)
    private String role = "USER";

    @Setter
    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public User() {
    }

}
