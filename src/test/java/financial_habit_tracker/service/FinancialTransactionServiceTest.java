
package financial_habit_tracker.service;

import financial_habit_tracker.entity.FinancialTransaction;
import financial_habit_tracker.entity.User;
import financial_habit_tracker.repository.CategoryRepository;
import financial_habit_tracker.repository.FinancialTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FinancialTransactionServiceTest {

    @Mock
    private FinancialTransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private FinancialTransactionService transactionService;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setName("Test User");
        currentUser.setEmail("test@example.com");
    }

    @Test
    void getAllTransactionsShouldReturnOnlyCurrentUsersTransactions() {
        when(currentUserService.getCurrentUserId()).thenReturn(1L);

        List<FinancialTransaction> expected = List.of(
                new FinancialTransaction()
        );

        when(transactionRepository.findAllByUserId(1L))
                .thenReturn(expected);

        List<FinancialTransaction> result =
                transactionService.getAllTransactions();

        assertEquals(expected, result);
        verify(transactionRepository).findAllByUserId(1L);
        verify(transactionRepository, never()).findAll();
    }

    @Test
    void deleteTransactionShouldRejectTransactionOwnedByAnotherUser() {
        when(currentUserService.getCurrentUserId()).thenReturn(1L);
        when(transactionRepository.findByIdAndUserId(99L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.deleteTransaction(99L)
        );

        verify(transactionRepository, never()).delete(any());
        verify(transactionRepository, never()).deleteById(anyLong());
    }

    @Test
    void updateTransactionShouldRejectTransactionOwnedByAnotherUser() {
        when(currentUserService.getCurrentUserId()).thenReturn(1L);
        when(transactionRepository.findByIdAndUserId(99L, 1L))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.updateTransaction(
                        99L, new FinancialTransaction()
                )
        );

        verify(transactionRepository, never()).save(any());
    }
}
