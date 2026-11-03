package financial_habit_tracker.dto;

import financial_habit_tracker.entity.FeedbackType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateFeedbackRequest(

        @NotBlank(message = "Subject is required")
        @Size(max = 150, message = "Subject cannot exceed 150 characters")
        String subject,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        String description,

        @NotNull(message = "Feedback type is required")
        FeedbackType type

) {
}