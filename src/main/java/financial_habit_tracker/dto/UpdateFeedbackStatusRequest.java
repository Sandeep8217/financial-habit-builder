package financial_habit_tracker.dto;

import financial_habit_tracker.entity.FeedbackStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateFeedbackStatusRequest(

        @NotNull(message = "Feedback status is required")
        FeedbackStatus status

) {
}