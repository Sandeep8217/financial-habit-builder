
package financial_habit_tracker.config;

import financial_habit_tracker.entity.Category;
import financial_habit_tracker.entity.CategoryType;
import financial_habit_tracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoryDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {

        List<Category> categories = List.of(
                // EXPENSE categories
                createCategory("Food", CategoryType.EXPENSE),
                createCategory("Transport", CategoryType.EXPENSE),
                createCategory("Shopping", CategoryType.EXPENSE),
                createCategory("Entertainment", CategoryType.EXPENSE),
                createCategory("Healthcare", CategoryType.EXPENSE),
                createCategory("Education", CategoryType.EXPENSE),
                createCategory("Bills & Utilities", CategoryType.EXPENSE),
                createCategory("Rent", CategoryType.EXPENSE),
                createCategory("Travel", CategoryType.EXPENSE),
                createCategory("Other", CategoryType.EXPENSE),

                // INCOME categories
                createCategory("Salary", CategoryType.INCOME),
                createCategory("Freelance", CategoryType.INCOME),
                createCategory("Business", CategoryType.INCOME),
                createCategory("Investments", CategoryType.INCOME),
                createCategory("Interest", CategoryType.INCOME),
                createCategory("Other", CategoryType.INCOME)
        );

        for (Category category : categories) {

            boolean exists = categoryRepository
                    .existsByNameIgnoreCaseAndType(
                            category.getName(),
                            category.getType()
                    );

            if (!exists) {
                categoryRepository.save(category);
            }
        }
    }

    private Category createCategory(String name, CategoryType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        return category;
    }
}
