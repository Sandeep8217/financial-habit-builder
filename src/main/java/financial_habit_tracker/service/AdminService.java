
package financial_habit_tracker.service;

import financial_habit_tracker.dto.AdminAnalyticsResponse;
import financial_habit_tracker.dto.AdminDashboardStatsResponse;
import financial_habit_tracker.dto.AdminUserResponse;
import financial_habit_tracker.dto.UserRegistrationTrendResponse;
import financial_habit_tracker.entity.FeedbackStatus;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final FinancialTransactionRepository transactionRepository;

    private final UserRepository userRepository;

    private final HabitRepository habitRepository;
    private final SavingsGoalRepository savingsGoalRepository;

    private final FeedbackRepository feedbackRepository;


    @Transactional(readOnly = true)

    public AdminAnalyticsResponse getAnalytics() {


        long totalHabits = habitRepository.count();
        long activeHabits = habitRepository.countByActiveTrue();
        long inactiveHabits = habitRepository.countByActiveFalse();

        long totalGoals = savingsGoalRepository.count();
        long completedGoals = savingsGoalRepository.countCompletedGoals();

        double completionRate = totalGoals == 0
                ? 0.0
                : (completedGoals * 100.0) / totalGoals;

        return new AdminAnalyticsResponse(
                totalHabits,
                activeHabits,
                inactiveHabits,
                totalGoals,
                completedGoals,
                Math.round(completionRate * 100.0) / 100.0
        );
    }

//    public AdminService(
//            UserRepository userRepository,
//            FinancialTransactionRepository transactionRepository
//    ) {
//        this.userRepository = userRepository;
//        this.transactionRepository = transactionRepository;
//    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        long totalTransactions = transactionRepository.count();

        long pendingFeedback =
                feedbackRepository.countByStatus(FeedbackStatus.PENDING);

        return new AdminDashboardStatsResponse(
                totalUsers,
                activeUsers,
                totalTransactions,
                pendingFeedback
        );
    }

    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getUsers(
            String search,
            String role,
            Pageable pageable
    ) {
        String normalizedSearch =
                search == null || search.isBlank()
                        ? null : search.trim();

        String normalizedRole =
                role == null || role.isBlank()
                        ? null : role.trim().toUpperCase();

        if (normalizedRole != null
                && !normalizedRole.equals("USER")
                && !normalizedRole.equals("ADMIN")) {
            throw new IllegalArgumentException("Invalid role filter");
        }

        return userRepository.searchUsers(
                normalizedSearch,
                normalizedRole,
                pageable
        ).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUser(Long userId) {
        User user = findUser(userId);
        return toResponse(user);
    }

    @Transactional
    public AdminUserResponse updateUserRole(
            Long userId,
            String newRole,
            String currentAdminEmail
    ) {
        User user = findUser(userId);

        String normalizedRole =
                newRole == null ? "" : newRole.trim().toUpperCase();

        if (!normalizedRole.equals("USER")
                && !normalizedRole.equals("ADMIN")) {
            throw new IllegalArgumentException("Invalid role");
        }

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)
                && !normalizedRole.equals("ADMIN")) {
            throw new AccessDeniedException(
                    "You cannot remove your own admin role"
            );
        }

        if (user.getRole().equalsIgnoreCase("ADMIN")
                && !normalizedRole.equals("ADMIN")) {
            ensureAnotherEnabledAdminExists(user);
        }

        user.setRole(normalizedRole);

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse updateUserStatus(
            Long userId,
            boolean enabled,
            String currentAdminEmail
    ) {
        User user = findUser(userId);

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)
                && !enabled) {
            throw new AccessDeniedException(
                    "You cannot disable your own account"
            );
        }

        if (user.getRole().equalsIgnoreCase("ADMIN")
                && user.isEnabled()
                && !enabled) {
            ensureAnotherEnabledAdminExists(user);
        }

        user.setEnabled(enabled);

        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public long getTotalUsers() {
        return userRepository.countByRoleIgnoreCase("USER")
                + userRepository.countByRoleIgnoreCase("ADMIN");
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private void ensureAnotherEnabledAdminExists(User user) {
        long enabledAdmins =
                userRepository.countByRoleIgnoreCaseAndEnabledTrue("ADMIN");

        if (enabledAdmins <= 1 && user.isEnabled()) {
            throw new IllegalStateException(
                    "Cannot disable or demote the last active admin"
            );
        }
    }

    private AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<UserRegistrationTrendResponse> getRegistrationTrend() {

        LocalDateTime startDate = LocalDate.now()
                .minusMonths(5)
                .withDayOfMonth(1)
                .atStartOfDay();

        return userRepository.getMonthlyRegistrationTrend(startDate)
                .stream()
                .map(item -> new UserRegistrationTrendResponse(
                        item.getMonth(),
                        item.getUsers()
                ))
                .toList();
    }
}
