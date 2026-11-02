
package financial_habit_tracker.service;

import financial_habit_tracker.dto.AdminUserResponse;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
