package financial_habit_tracker.controller;

import financial_habit_tracker.dto.CreateFeedbackRequest;
import financial_habit_tracker.dto.FeedbackResponse;
import financial_habit_tracker.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // Submit feedback
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeedbackResponse createFeedback(
            @Valid @RequestBody CreateFeedbackRequest request,
            Authentication authentication
    ) {
        return feedbackService.createFeedback(
                request,
                authentication.getName()
        );
    }

    // Get feedback submitted by the logged-in user
    @GetMapping("/my")
    public List<FeedbackResponse> getMyFeedback(
            Authentication authentication
    ) {
        return feedbackService.getMyFeedback(authentication.getName());
    }
}