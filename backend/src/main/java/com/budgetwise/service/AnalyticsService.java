package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getCategorySpendingData(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> expenses = transactionRepository.findByUserAndType(user, "expense");
        
        Map<String, Double> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                    Transaction::getCategory,
                    Collectors.summingDouble(Transaction::getAmount)
                ));

        List<Map<String, Object>> chartData = categoryTotals.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("data", chartData);
        result.put("total", categoryTotals.values().stream().mapToDouble(Double::doubleValue).sum());
        result.put("categories", new ArrayList<>(categoryTotals.keySet()));
        
        return result;
    }

    public Map<String, Object> getSubcategorySpendingData(String username, String category) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> categoryExpenses = transactionRepository.findByUserAndTypeAndCategory(user, "expense", category);
        
        Map<String, Double> subcategoryTotals = categoryExpenses.stream()
                .collect(Collectors.groupingBy(
                    Transaction::getDescription,
                    Collectors.summingDouble(Transaction::getAmount)
                ));

        List<Map<String, Object>> chartData = subcategoryTotals.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("name", entry.getKey());
                    item.put("value", entry.getValue());
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("data", chartData);
        result.put("total", subcategoryTotals.values().stream().mapToDouble(Double::doubleValue).sum());
        result.put("category", category);
        
        return result;
    }
}