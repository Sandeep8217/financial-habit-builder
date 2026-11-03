package financial_habit_tracker.service;

import financial_habit_tracker.dto.CreateFeedbackRequest;
import financial_habit_tracker.dto.FeedbackResponse;
import financial_habit_tracker.dto.UpdateFeedbackStatusRequest;
import financial_habit_tracker.entity.Feedback;
import financial_habit_tracker.entity.FeedbackStatus;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.FeedbackRepository;
import financial_habit_tracker.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Transactional
    public FeedbackResponse createFeedback(
            CreateFeedbackRequest request,
            String email
    ) {
        User user = getUser(email);

        Feedback feedback = new Feedback();
        feedback.setSubject(request.subject().trim());
        feedback.setDescription(request.description().trim());
        feedback.setType(request.type());
        feedback.setUser(user);

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getMyFeedback(String email) {
        User user = getUser(email);

        return feedbackRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getAllFeedback(FeedbackStatus status) {

        List<Feedback> feedbackList = status == null
                ? feedbackRepository.findAllByOrderByCreatedAtDesc()
                : feedbackRepository.findAllByStatusOrderByCreatedAtDesc(status);

        return feedbackList.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public FeedbackResponse updateFeedbackStatus(
            Long feedbackId,
            UpdateFeedbackStatusRequest request
    ) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Feedback not found"));

        feedback.setStatus(request.status());

        return mapToResponse(feedbackRepository.save(feedback));
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found"));
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        User user = feedback.getUser();

        return new FeedbackResponse(
                feedback.getId(),
                feedback.getSubject(),
                feedback.getDescription(),
                feedback.getType(),
                feedback.getStatus(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                feedback.getCreatedAt(),
                feedback.getUpdatedAt()
        );
    }
}