
package financial_habit_tracker.service;

import financial_habit_tracker.entity.Liability;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.LiabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiabilityService {

    private final LiabilityRepository liabilityRepository;
    private final CurrentUserService currentUserService;

    public List<Liability> getAllLiabilities() {
        Long userId = currentUserService.getCurrentUserId();
        return liabilityRepository.findAllByUserId(userId);
    }

    @Transactional
    public Liability createLiability(Liability liability) {
        User currentUser = currentUserService.getCurrentUser();

        liability.setId(null);
        liability.setUser(currentUser);

        return liabilityRepository.save(liability);
    }

    @Transactional
    public Liability updateLiability(Long id, Liability updatedLiability) {
        Long userId = currentUserService.getCurrentUserId();

        Liability existing = liabilityRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Liability not found"));

        existing.setName(updatedLiability.getName());
        existing.setOutstandingAmount(
                updatedLiability.getOutstandingAmount());

        return liabilityRepository.save(existing);
    }

    @Transactional
    public void deleteLiability(Long id) {
        Long userId = currentUserService.getCurrentUserId();

        Liability liability = liabilityRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Liability not found"));

        liabilityRepository.delete(liability);
    }
}
