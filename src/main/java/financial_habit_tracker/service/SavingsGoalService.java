
package financial_habit_tracker.service;

import financial_habit_tracker.entity.SavingsGoal;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final CurrentUserService currentUserService;

    public List<SavingsGoal> getAllGoals() {
        Long userId = currentUserService.getCurrentUserId();
        return savingsGoalRepository.findAllByUserId(userId);
    }

    @Transactional
    public SavingsGoal createGoal(SavingsGoal goal) {
        User currentUser = currentUserService.getCurrentUser();

        goal.setId(null);
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setUser(currentUser);

        return savingsGoalRepository.save(goal);
    }


    @Transactional
    public SavingsGoal addContribution(Long id, BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Contribution must be greater than zero"
            );
        }

        Long userId = currentUserService.getCurrentUserId();

        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Savings goal not found"
                ));

        BigDecimal targetAmount = goal.getTargetAmount();
        BigDecimal currentAmount = goal.getCurrentAmount();

        if (targetAmount != null
                && currentAmount.add(amount).compareTo(targetAmount) > 0) {
            throw new IllegalArgumentException(
                    "Contribution cannot exceed the remaining goal amount"
            );
        }

        goal.setCurrentAmount(currentAmount.add(amount));

        return savingsGoalRepository.save(goal);
    }


    @Transactional
    public void deleteGoal(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Savings goal not found"));

        savingsGoalRepository.delete(goal);
    }
}
