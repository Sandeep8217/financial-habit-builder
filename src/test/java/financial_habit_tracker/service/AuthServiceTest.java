
package financial_habit_tracker.service;

import financial_habit_tracker.dto.AuthResponse;
import financial_habit_tracker.dto.LoginRequest;
import financial_habit_tracker.dto.RegisterRequest;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerShouldSaveUserWithEncodedPassword() {
        RegisterRequest request = new RegisterRequest(
                "Test User",
                "TestUser@example.com",
                "StrongPass123!"
        );

        when(userRepository.existsByEmailIgnoreCase(
                "testuser@example.com"
        )).thenReturn(false);

        when(passwordEncoder.encode("StrongPass123!"))
                .thenReturn("bcrypt-hash");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(jwtService.generateToken("testuser@example.com"))
                .thenReturn("test-jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> captor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertEquals("Test User", savedUser.getName());
        assertEquals("testuser@example.com", savedUser.getEmail());
        assertEquals("bcrypt-hash", savedUser.getPasswordHash());
        assertEquals("USER", savedUser.getRole());

        assertEquals("testuser@example.com", response.email());
        assertEquals("test-jwt-token", response.token());
        assertEquals("Bearer", response.tokenType());
    }

    @Test
    void registerShouldRejectDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Test User",
                "test@example.com",
                "StrongPass123!"
        );

        when(userRepository.existsByEmailIgnoreCase(
                "test@example.com"
        )).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(request)
        );

        assertEquals(409, exception.getStatusCode().value());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginShouldReturnTokenForValidCredentials() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPasswordHash("bcrypt-hash");
        user.setRole("USER");

        when(userRepository.findByEmailIgnoreCase("test@example.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "StrongPass123!",
                "bcrypt-hash"
        )).thenReturn(true);

        when(jwtService.generateToken("test@example.com"))
                .thenReturn("test-jwt-token");

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "StrongPass123!"
        );

        AuthResponse response = authService.login(request);

        assertEquals("test@example.com", response.email());
        assertEquals("test-jwt-token", response.token());
        assertEquals("Bearer", response.tokenType());
    }

    @Test
    void loginShouldRejectIncorrectPassword() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPasswordHash("bcrypt-hash");
        user.setRole("USER");

        when(userRepository.findByEmailIgnoreCase("test@example.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "WrongPass123!",
                "bcrypt-hash"
        )).thenReturn(false);

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "WrongPass123!"
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(401, exception.getStatusCode().value());

        verify(jwtService, never()).generateToken(anyString());
    }
}
