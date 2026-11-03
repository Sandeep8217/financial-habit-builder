package financial_habit_tracker.controller;

import financial_habit_tracker.dto.FeedbackResponse;
import financial_habit_tracker.dto.UpdateFeedbackStatusRequest;
import financial_habit_tracker.entity.FeedbackStatus;
import financial_habit_tracker.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/feedback")
@RequiredArgsConstructor
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    // Get all feedback, optionally filtered by status
    @GetMapping
    public List<FeedbackResponse> getAllFeedback(
            @RequestParam(required = false) FeedbackStatus status
    ) {
        return feedbackService.getAllFeedback(status);
    }

    // Update feedback status
    @PatchMapping("/{id}/status")
    public FeedbackResponse updateFeedbackStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFeedbackStatusRequest request
    ) {
        return feedbackService.updateFeedbackStatus(id, request);
    }
}