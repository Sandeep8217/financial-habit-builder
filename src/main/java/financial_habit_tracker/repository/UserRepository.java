
package financial_habit_tracker.repository;

import financial_habit_tracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    long countByRoleIgnoreCaseAndEnabledTrue(String role);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRoleIgnoreCase(String role);

    @Query("""
            SELECT u FROM User u
            WHERE (:role IS NULL OR LOWER(u.role) = LOWER(:role))
            AND (
                :search IS NULL
                OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            )
            """)
    Page<User> searchUsers(
            @Param("search") String search,
            @Param("role") String role,
            Pageable pageable
    );
}
