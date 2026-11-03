package financial_habit_tracker.dto;

public record AdminDashboardStatsResponse(
        long totalUsers,
        long activeUsers,
        long totalTransactions,
        long pendingFeedback
) {
}