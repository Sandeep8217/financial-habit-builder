package financial_habit_tracker.dto;

import financial_habit_tracker.entity.FeedbackStatus;
import financial_habit_tracker.entity.FeedbackType;

import java.time.LocalDateTime;

public record FeedbackResponse(
        Long id,
        String subject,
        String description,
        FeedbackType type,
        FeedbackStatus status,
        Long userId,
        String userName,
        String userEmail,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}