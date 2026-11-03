
package financial_habit_tracker.repository;

import financial_habit_tracker.dto.UserRegistrationTrendResponse;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.projection.UserRegistrationTrendProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    long countByEnabledTrue();

    long countByRoleIgnoreCaseAndEnabledTrue(String role);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRoleIgnoreCase(String role);

    @Query("""
    SELECT u FROM User u
    WHERE
        (COALESCE(:role, '') = ''
            OR LOWER(u.role) = LOWER(:role))
    AND
        (COALESCE(:search, '') = ''
            OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<User> searchUsers(
            @Param("search") String search,
            @Param("role") String role,
            Pageable pageable
    );

    @Query(value = """
    SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
        COUNT(*) AS users
    FROM app_users
    WHERE created_at >= :startDate
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
    """, nativeQuery = true)
    List<UserRegistrationTrendProjection> getMonthlyRegistrationTrend(
            @Param("startDate") LocalDateTime startDate
    );

}
