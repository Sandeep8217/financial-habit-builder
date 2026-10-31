
package financial_habit_tracker.service;

import financial_habit_tracker.dto.AuthResponse;
import financial_habit_tracker.dto.LoginRequest;
import financial_habit_tracker.dto.RegisterRequest;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists"
            );
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        return createAuthResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!user.isEnabled()
                || !passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token,
                "Bearer"
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
