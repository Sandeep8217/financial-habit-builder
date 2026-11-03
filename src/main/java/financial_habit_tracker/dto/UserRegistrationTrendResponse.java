package financial_habit_tracker.dto;

public record UserRegistrationTrendResponse(
        String month,
        Long users
) {
}