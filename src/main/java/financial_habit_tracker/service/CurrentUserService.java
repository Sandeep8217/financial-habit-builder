
package financial_habit_tracker.service;

import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UsernameNotFoundException(
                    "No authenticated user found"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Authenticated user was not found"
                ));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
