
package financial_habit_tracker.controller;

import financial_habit_tracker.entity.Habit;
import financial_habit_tracker.entity.HabitCompletion;
import financial_habit_tracker.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @GetMapping
    public List<Habit> getAllHabits() {
        return habitService.getAllHabits();
    }

    @PostMapping
    public Habit createHabit(@Valid @RequestBody Habit habit) {
        return habitService.createHabit(habit);
    }

    @PostMapping("/{id}/complete")
    public Habit completeHabit(@PathVariable Long id) {
        return habitService.completeHabit(id);
    }

    @GetMapping("/{id}/history")
    public List<HabitCompletion> getCompletionHistory(
            @PathVariable Long id) {
        return habitService.getCompletionHistory(id);
    }

    @DeleteMapping("/{id}")
    public void deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
    }
}
