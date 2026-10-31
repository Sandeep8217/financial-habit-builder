
package financial_habit_tracker.config;

import financial_habit_tracker.controller.CategoryController;
import financial_habit_tracker.service.CategoryService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CategoryController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CategorySecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryService categoryService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void categoryListingShouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    void creatingCategoryShouldRequireAdminRole() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Test Category",
                                  "type": "EXPENSE"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void deletingCategoryShouldRequireAdminRole() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isForbidden());
    }
}
