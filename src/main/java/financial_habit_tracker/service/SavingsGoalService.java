
package financial_habit_tracker.service;

import financial_habit_tracker.entity.SavingsGoal;
import financial_habit_tracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    public List<SavingsGoal> getAllGoals() {
        return savingsGoalRepository.findAll();
    }

    public SavingsGoal createGoal(SavingsGoal goal) {
        goal.setId(null);
        goal.setCurrentAmount(BigDecimal.ZERO);
        return savingsGoalRepository.save(goal);
    }

    @Transactional
    public SavingsGoal addContribution(Long id, BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Contribution must be greater than zero");
        }

        SavingsGoal goal = savingsGoalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Savings goal not found"));

        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        return savingsGoalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        if (!savingsGoalRepository.existsById(id)) {
            throw new IllegalArgumentException("Savings goal not found");
        }

        savingsGoalRepository.deleteById(id);
    }
}
