package financial_habit_tracker.dto;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String role,
        boolean enabled,
        LocalDateTime createdAt
) {
}