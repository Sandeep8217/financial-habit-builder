
package financial_habit_tracker.controller;

import financial_habit_tracker.dto.AdminAnalyticsResponse;
import financial_habit_tracker.dto.AdminDashboardStatsResponse;
import financial_habit_tracker.dto.AdminUserResponse;
import financial_habit_tracker.dto.UserRegistrationTrendResponse;
import financial_habit_tracker.service.AdminService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // List, search and filter users
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                adminService.getUsers(search, role, pageable)
        );
    }

    // Get individual user details
    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> getUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                adminService.getUser(id)
        );
    }

    // Update user role
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                adminService.updateUserRole(
                        id,
                        role,
                        authentication.getName()
                )
        );
    }

    // Enable or disable user account
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                adminService.updateUserStatus(
                        id,
                        enabled,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(
                adminService.getDashboardStats()
        );
    }

    @GetMapping("/registration-trend")
    public ResponseEntity<List<UserRegistrationTrendResponse>> getRegistrationTrend() {
        return ResponseEntity.ok(
                adminService.getRegistrationTrend()
        );
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(
                adminService.getAnalytics()
        );
    }
}
