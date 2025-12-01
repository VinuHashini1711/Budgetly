package com.budgetwise.service;

import com.budgetwise.dto.TransactionResponse;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimpleExportService {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String exportToCsv(String sections) {
        try {
            StringBuilder csv = new StringBuilder();
            String[] sectionArray = sections.split(",");
            
            for (String section : sectionArray) {
                switch (section.trim()) {
                    case "dashboard":
                        csv.append(generateDashboardCsv());
                        break;
                    case "transactions":
                        csv.append(generateTransactionsCsv());
                        break;
                    case "budgets":
                        csv.append(generateBudgetsCsv());
                        break;
                    case "goals":
                        csv.append(generateGoalsCsv());
                        break;
                    case "ai-insights":
                        csv.append(generateAIInsightsCsv());
                        break;
                    case "all":
                        csv.append(generateDashboardCsv());
                        csv.append(generateTransactionsCsv());
                        csv.append(generateBudgetsCsv());
                        csv.append(generateGoalsCsv());
                        csv.append(generateAIInsightsCsv());
                        break;
                }
                csv.append("\n");
            }

            return csv.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }

    private String generateDashboardCsv() {
        List<TransactionResponse> transactions = transactionService.getUserTransactions();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        
        for (TransactionResponse t : transactions) {
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                totalIncome = totalIncome.add(t.getAmount());
            } else {
                totalExpenses = totalExpenses.add(t.getAmount());
            }
        }
        
        StringBuilder csv = new StringBuilder();
        csv.append("DASHBOARD SUMMARY\n");
        csv.append("Metric,Amount\n");
        csv.append("Total Income,").append(totalIncome).append("\n");
        csv.append("Total Expenses,").append(totalExpenses).append("\n");
        csv.append("Net Balance,").append(totalIncome.subtract(totalExpenses)).append("\n");
        csv.append("Total Transactions,").append(transactions.size()).append("\n");
        return csv.toString();
    }

    private String generateTransactionsCsv() {
        List<TransactionResponse> transactions = transactionService.getUserTransactions();
        StringBuilder csv = new StringBuilder();
        csv.append("TRANSACTIONS\n");
        csv.append("Date,Description,Category,Type,Amount,Payment Method\n");
        
        for (TransactionResponse t : transactions) {
            csv.append(t.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))).append(",");
            csv.append("\"").append(t.getDescription()).append("\",");
            csv.append(t.getCategory()).append(",");
            csv.append(t.getType()).append(",");
            csv.append(t.getAmount()).append(",");
            csv.append(t.getPaymentMethod() != null ? t.getPaymentMethod() : "").append("\n");
        }
        return csv.toString();
    }

    private String generateBudgetsCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("BUDGETS\n");
        csv.append("Category,Amount,Start Date,End Date\n");
        // Add budget data here when budget service is available
        csv.append("No budget data available\n");
        return csv.toString();
    }

    private String generateGoalsCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("FINANCIAL GOALS\n");
        csv.append("Goal Name,Category,Target Amount,Current Amount,Deadline,Priority\n");
        // Add goals data here when goals service is available
        csv.append("No goals data available\n");
        return csv.toString();
    }

    private String generateAIInsightsCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("AI FINANCIAL INSIGHTS\n");
        csv.append("Insight Type,Recommendation\n");
        csv.append("Spending Analysis,Review your transaction patterns for optimization\n");
        csv.append("Budget Recommendation,Create category-wise budgets based on spending history\n");
        csv.append("Savings Tip,Consider automating savings transfers\n");
        return csv.toString();
    }

    public String exportToHtml(String sections) {
        try {
            User user = getCurrentUser();
            StringBuilder html = new StringBuilder();
            html.append("<!DOCTYPE html><html><head><title>Financial Report</title>");
            html.append("<style>body{font-family:Arial,sans-serif;margin:20px;}");
            html.append("table{border-collapse:collapse;width:100%;margin:20px 0;}");
            html.append("th,td{border:1px solid #ddd;padding:8px;text-align:left;}");
            html.append("th{background-color:#f2f2f2;}");
            html.append(".section{margin:30px 0;padding:20px;border:1px solid #eee;}");
            html.append("</style></head><body>");
            
            html.append("<h1>BudgetwiseAI - Financial Report</h1>");
            html.append("<p><strong>User:</strong> ").append(user.getUsername()).append("</p>");
            html.append("<p><strong>Generated:</strong> ").append(java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))).append("</p>");
            
            String[] sectionArray = sections.split(",");
            
            for (String section : sectionArray) {
                switch (section.trim()) {
                    case "dashboard":
                        html.append(generateDashboardHtml());
                        break;
                    case "transactions":
                        html.append(generateTransactionsHtml());
                        break;
                    case "budgets":
                        html.append(generateBudgetsHtml());
                        break;
                    case "goals":
                        html.append(generateGoalsHtml());
                        break;
                    case "ai-insights":
                        html.append(generateAIInsightsHtml());
                        break;
                    case "all":
                        html.append(generateDashboardHtml());
                        html.append(generateTransactionsHtml());
                        html.append(generateBudgetsHtml());
                        html.append(generateGoalsHtml());
                        html.append(generateAIInsightsHtml());
                        break;
                }
            }
            
            html.append("</body></html>");
            return html.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HTML", e);
        }
    }

    private String generateDashboardHtml() {
        List<TransactionResponse> transactions = transactionService.getUserTransactions();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        
        for (TransactionResponse t : transactions) {
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                totalIncome = totalIncome.add(t.getAmount());
            } else {
                totalExpenses = totalExpenses.add(t.getAmount());
            }
        }
        
        StringBuilder html = new StringBuilder();
        html.append("<div class='section'><h2>📊 Dashboard Summary</h2>");
        html.append("<p><strong>Total Income:</strong> ₹").append(totalIncome).append("</p>");
        html.append("<p><strong>Total Expenses:</strong> ₹").append(totalExpenses).append("</p>");
        html.append("<p><strong>Net Balance:</strong> ₹").append(totalIncome.subtract(totalExpenses)).append("</p>");
        html.append("<p><strong>Total Transactions:</strong> ").append(transactions.size()).append("</p></div>");
        return html.toString();
    }

    private String generateTransactionsHtml() {
        List<TransactionResponse> transactions = transactionService.getUserTransactions();
        StringBuilder html = new StringBuilder();
        html.append("<div class='section'><h2>💳 Transaction Details</h2>");
        html.append("<table><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr>");
        
        for (TransactionResponse t : transactions) {
            html.append("<tr>");
            html.append("<td>").append(t.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"))).append("</td>");
            html.append("<td>").append(t.getDescription()).append("</td>");
            html.append("<td>").append(t.getCategory()).append("</td>");
            html.append("<td>").append(t.getType()).append("</td>");
            html.append("<td>₹").append(t.getAmount()).append("</td>");
            html.append("</tr>");
        }
        html.append("</table></div>");
        return html.toString();
    }

    private String generateBudgetsHtml() {
        StringBuilder html = new StringBuilder();
        html.append("<div class='section'><h2>💰 Budgets</h2>");
        html.append("<p>Budget management features coming soon...</p>");
        html.append("<p>This section will show your budget allocations and spending against budgets.</p></div>");
        return html.toString();
    }

    private String generateGoalsHtml() {
        StringBuilder html = new StringBuilder();
        html.append("<div class='section'><h2>🎯 Financial Goals</h2>");
        html.append("<p>Goal tracking features available in the app.</p>");
        html.append("<p>This section will show your financial goals and progress.</p></div>");
        return html.toString();
    }

    private String generateAIInsightsHtml() {
        StringBuilder html = new StringBuilder();
        html.append("<div class='section'><h2>🤖 AI Financial Insights</h2>");
        html.append("<h3>Spending Analysis</h3>");
        html.append("<p>• Review your transaction patterns for potential savings</p>");
        html.append("<p>• Identify categories with highest spending</p>");
        html.append("<h3>Budget Recommendations</h3>");
        html.append("<p>• Create category-wise budgets based on spending history</p>");
        html.append("<p>• Set realistic spending limits for each category</p>");
        html.append("<h3>Savings Tips</h3>");
        html.append("<p>• Consider automating savings transfers</p>");
        html.append("<p>• Look for subscription services you can cancel</p></div>");
        return html.toString();
    }
}