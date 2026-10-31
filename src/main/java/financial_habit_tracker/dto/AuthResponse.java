
package financial_habit_tracker.dto;

public record AuthResponse(
        Long id,
        String name,
        String email,
        String role,
        String token,
        String tokenType
) {
}
