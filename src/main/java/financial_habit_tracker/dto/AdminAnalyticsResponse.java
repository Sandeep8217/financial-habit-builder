package financial_habit_tracker.dto;

public record AdminAnalyticsResponse(
        long totalHabits,
        long activeHabits,
        long inactiveHabits,
        long totalSavingsGoals,
        long completedSavingsGoals,
        double savingsGoalCompletionRate
) {
}