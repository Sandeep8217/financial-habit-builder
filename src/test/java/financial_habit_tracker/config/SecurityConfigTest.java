
package financial_habit_tracker.config;

import financial_habit_tracker.config.JwtAuthenticationFilter;
import financial_habit_tracker.config.SecurityConfig;
import financial_habit_tracker.controller.AuthController;
import financial_habit_tracker.dto.AuthResponse;
import financial_habit_tracker.dto.RegisterRequest;
import financial_habit_tracker.service.AuthService;
import financial_habit_tracker.service.JwtService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void registrationShouldBeAccessibleWithoutToken() throws Exception {

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(new AuthResponse(
                        1L,
                        "Test User",
                        "test@example.com",
                        "USER",
                        "test-jwt-token",
                        "Bearer"
                ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Test User",
                                  "email": "test@example.com",
                                  "password": "StrongPass123!"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }


    @Test
    void loginShouldBeAccessibleWithoutToken() throws Exception {

        when(authService.login(any(
                financial_habit_tracker.dto.LoginRequest.class
        ))).thenReturn(new AuthResponse(
                1L,
                "Test User",
                "test@example.com",
                "USER",
                "test-jwt-token",
                "Bearer"
        ));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "email": "test@example.com",
                              "password": "StrongPass123!"
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }


    @Test
    void protectedEndpointShouldRejectRequestWithoutToken()
            throws Exception {

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isForbidden());
    }
}
