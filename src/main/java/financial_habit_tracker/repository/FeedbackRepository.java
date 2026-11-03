package financial_habit_tracker.repository;

import financial_habit_tracker.entity.Feedback;
import financial_habit_tracker.entity.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<Feedback> findAllByOrderByCreatedAtDesc();

    List<Feedback> findAllByStatusOrderByCreatedAtDesc(
            FeedbackStatus status
    );
    long countByStatus(FeedbackStatus status);
}