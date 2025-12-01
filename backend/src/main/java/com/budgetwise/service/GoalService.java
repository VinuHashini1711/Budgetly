package com.budgetwise.service;

import com.budgetwise.dto.GoalRequest;
import com.budgetwise.dto.GoalResponse;
import com.budgetwise.model.Goal;
import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.GoalRepository;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    private User getCurrentUser() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public GoalResponse createGoal(GoalRequest request) {
        User user = getCurrentUser();

        Goal goal = Goal.builder()
                .goalName(request.getGoalName())
                .category(request.getCategory())
                .targetAmount(request.getTargetAmount())
                .currentAmount(request.getCurrentAmount() != null ? request.getCurrentAmount() : 0.0)
                .deadline(request.getDeadline())
                .priority(request.getPriority())
                .createdAt(LocalDate.now())
                .user(user)
                .build();

        goal = goalRepository.save(goal);
        return mapToResponse(goal);
    }

    public List<GoalResponse> getUserGoals() {
        User user = getCurrentUser();
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return goals.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public GoalResponse getGoalById(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        User currentUser = getCurrentUser();
        if (!goal.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to access this goal");
        }

        return mapToResponse(goal);
    }

    public GoalResponse updateGoal(Long id, GoalRequest request) {
        User user = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this goal");
        }

        // Check if current amount is being increased
        Double oldAmount = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0;
        Double newAmount = request.getCurrentAmount() != null ? request.getCurrentAmount() : 0.0;
        
        System.out.println("Goal Update - Old Amount: " + oldAmount + ", New Amount: " + newAmount);
        
        if (newAmount > oldAmount) {
            // Create a transaction for the money added to savings
            Double addedAmount = newAmount - oldAmount;
            System.out.println("Creating savings transaction for amount: " + addedAmount);
            createSavingsTransaction(user, goal.getGoalName(), addedAmount);
        }

        goal.setGoalName(request.getGoalName());
        goal.setCategory(request.getCategory());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setCurrentAmount(request.getCurrentAmount());
        goal.setDeadline(request.getDeadline());
        goal.setPriority(request.getPriority());

        goal = goalRepository.save(goal);
        return mapToResponse(goal);
    }

    private void createSavingsTransaction(User user, String goalName, Double amount) {
        System.out.println("Creating transaction: Transfer to " + goalName + " savings, Amount: " + amount);
        
        Transaction transaction = Transaction.builder()
                .description("Transfer to " + goalName + " savings")
                .amount(BigDecimal.valueOf(amount))
                .category("Savings")
                .type("EXPENSE")
                .date(LocalDateTime.now())
                .paymentMethod("Transfer")
                .currency("INR")
                .user(user)
                .build();
        
        Transaction saved = transactionRepository.save(transaction);
        System.out.println("Transaction saved with ID: " + saved.getId());
    }

    public void deleteGoal(Long id) {
        User user = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this goal");
        }

        goalRepository.delete(goal);
    }

    private GoalResponse mapToResponse(Goal goal) {
        return GoalResponse.builder()
                .id(goal.getId())
                .goalName(goal.getGoalName())
                .category(goal.getCategory())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .deadline(goal.getDeadline())
                .priority(goal.getPriority())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
