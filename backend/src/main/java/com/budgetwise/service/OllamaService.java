package com.budgetwise.service;

import com.budgetwise.dto.AIInsightRequest;
import com.budgetwise.dto.AIInsightResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Service
public class OllamaService {

    private final WebClient webClient;
    private final String model;
    private final ObjectMapper objectMapper;
    private final int timeout;

    public OllamaService(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model,
                        @Value("${ollama.timeout:120000}") int timeout) {
        this.model = model;
        this.timeout = timeout;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
        log.info("OllamaService initialized with model: {}, timeout: {}ms", model, timeout);
    }

    public AIInsightResponse generateInsight(AIInsightRequest request) {
        try {
            // Decode HTML entities from context
            String cleanContext = decodeHtmlEntities(request.getContext());
            
            log.info("Generating AI insight for query: {}", request.getQuery());
            log.info("Financial context: {}", cleanContext);
            
            AIInsightRequest cleanRequest = new AIInsightRequest();
            cleanRequest.setQuery(request.getQuery());
            cleanRequest.setContext(cleanContext);
            
            // Check for predefined responses first
            String predefinedResponse = getPredefinedResponse(cleanRequest);
            if (predefinedResponse != null) {
                log.info("Using predefined response for query type");
                return AIInsightResponse.builder()
                    .insight(predefinedResponse)
                    .category(extractCategory(predefinedResponse))
                    .recommendation("Follow the above suggestions for better financial management.")
                    .build();
            }
            
            String prompt = buildPrompt(cleanRequest);
            log.info("Full prompt sent to Ollama: {}", prompt);
            
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
            );

            log.info("Sending request to Ollama at: /api/generate with timeout: {}ms", timeout);
            long startTime = System.currentTimeMillis();
            
            String response = webClient.post()
                    .uri("/api/generate")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(timeout))
                    .block();

            long duration = System.currentTimeMillis() - startTime;
            log.info("Received response from Ollama in {}ms", duration);
            
            // Log raw response for debugging
            log.info("Raw Ollama response length: {} characters", response.length());
            log.debug("Full Ollama response: {}", response);
            
            return parseResponse(response);
            
        } catch (Exception e) {
            log.error("Error generating AI insight. Error type: {}, Message: {}", 
                     e.getClass().getSimpleName(), e.getMessage());
            
            String errorMsg = e.getMessage();
            if (e.getCause() != null) {
                errorMsg += " (Cause: " + e.getCause().getMessage() + ")";
            }
            
            return AIInsightResponse.builder()
                    .insight("I'm having trouble connecting to the AI service right now. " + 
                            (errorMsg.contains("timeout") ? "The request took too long to process." : ""))
                    .category("Error")
                    .recommendation("Please try again or check if Ollama is running properly.")
                    .build();
        }
    }

    private String buildPrompt(AIInsightRequest request) {
        // This method now only handles queries that need AI processing
        String query = request.getQuery().toLowerCase();
        
        return String.format("""
            You are a financial advisor for India. Use ₹ symbol. Be structured and professional.
            
            User Question: %s
            Financial Data: %s
            
            Provide response in this format:
            
            **Financial Analysis:**
            • [Analysis point 1]
            • [Analysis point 2]
            
            **Recommendations:**
            • [Specific recommendation with ₹ amount]
            • [Specific recommendation with ₹ amount]
            • [Specific recommendation with ₹ amount]
            
            **Action Steps:**
            • [Immediate action to take]
            • [Long-term strategy]
            
            Keep it concise and actionable.
            """, request.getQuery(), request.getContext());
    }
    
    private String extractUsername(String context) {
        // Try to extract username from context - simple implementation
        if (context != null && context.contains("user")) {
            // This is a basic extraction - you can enhance based on your context format
            return "";
        }
        return "";
    }
    
    private boolean isFinancialQuery(String query) {
        String[] financialKeywords = {
            "money", "budget", "save", "saving", "invest", "investment", "expense", "spend", "spending",
            "income", "salary", "financial", "finance", "bank", "loan", "debt", "credit", "fund",
            "sip", "ppf", "fd", "mutual", "stock", "tax", "insurance", "emergency", "retirement",
            "cost", "price", "rupee", "₹", "account", "transaction", "payment", "cash", "wealth",
            "category", "analysis", "plan", "advice", "tip", "help", "manage", "optimize"
        };
        
        for (String keyword : financialKeywords) {
            if (query.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
    
    private String getPredefinedResponse(AIInsightRequest request) {
        String query = request.getQuery().toLowerCase();
        String username = extractUsername(request.getContext());
        String greeting = username.isEmpty() ? "there" : username;
        
        // Greeting responses
        if (query.contains("hi") || query.contains("hello") || query.contains("hey")) {
            return String.format("Hi %s! I'm your AI financial advisor. How can I assist you with your finances today?", greeting);
        }
        
        // Non-financial query responses
        if (!isFinancialQuery(query)) {
            return "I'm your AI financial advisor, specialized only in money matters. Please ask me about budgeting, savings, investments, expenses, or financial planning. How can I help you with your finances today?";
        }
        
        // Category-wise spending analysis
        if (query.contains("category") && (query.contains("spending") || query.contains("expense"))) {
            return getCategoryWiseSpendingResponse(request.getContext());
        }
        
        // Where am I spending too much
        if (query.contains("spending too much") || query.contains("overspending") || (query.contains("where") && query.contains("spending"))) {
            return getOverspendingAnalysis(request.getContext());
        }
        
        // Saving plan requests
        if (query.contains("saving plan") || query.contains("save money") || query.contains("how to save")) {
            return getSavingPlanResponse(request.getContext());
        }
        
        // Investment advice
        if (query.contains("invest") || query.contains("sip") || query.contains("mutual fund") || query.contains("ppf")) {
            return getInvestmentAdvice(request.getContext());
        }
        
        // Budget planning
        if (query.contains("budget") || query.contains("monthly plan")) {
            return getBudgetPlanResponse(request.getContext());
        }
        
        return null; // No predefined response, use AI
    }
    
    private String getCategoryWiseSpendingResponse(String context) {
        FinancialData data = parseFinancialContext(context);
        
        StringBuilder response = new StringBuilder();
        response.append("📊 Category-wise Spending Analysis\n\n");
        response.append("Based on your transaction data:\n\n");
        
        // Calculate category totals
        Map<String, Double> categoryTotals = new java.util.HashMap<>();
        for (String transaction : data.transactions) {
            String[] parts = transaction.split(" - ");
            if (parts.length >= 2) {
                String category = parts[1].split(" ")[0];
                double amount = extractAmount(transaction);
                categoryTotals.put(category, categoryTotals.getOrDefault(category, 0.0) + amount);
            }
        }
        
        // Display categories
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            double percentage = (entry.getValue() / data.totalExpenses) * 100;
            response.append(String.format("• %s: ₹%.0f (%.0f%% of expenses)\n", 
                entry.getKey(), entry.getValue(), percentage));
        }
        
        response.append("\n💡 Key Insights:\n");
        response.append(String.format("• Total expenses: ₹%.0f (%.0f%% of income)\n", 
            data.totalExpenses, (data.totalExpenses / data.totalIncome) * 100));
        response.append(String.format("• Net balance: ₹%.0f\n", data.netBalance));
        
        // Find highest expense category
        String highestCategory = categoryTotals.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Unknown");
        
        response.append("\n🎯 Recommendations:\n");
        response.append(String.format("• Monitor %s expenses closely\n", highestCategory));
        response.append("• Consider setting category-wise budget limits\n");
        response.append("• Use expense tracking apps for better control\n");
        
        return response.toString();
    }
    
    private String getOverspendingAnalysis(String context) {
        FinancialData data = parseFinancialContext(context);
        
        StringBuilder response = new StringBuilder();
        response.append("⚠️ Overspending Analysis\n\n");
        
        // Calculate category percentages
        Map<String, Double> categoryTotals = new java.util.HashMap<>();
        for (String transaction : data.transactions) {
            String[] parts = transaction.split(" - ");
            if (parts.length >= 2) {
                String category = parts[1].split(" ")[0];
                double amount = extractAmount(transaction);
                categoryTotals.put(category, categoryTotals.getOrDefault(category, 0.0) + amount);
            }
        }
        
        response.append("🔴 Areas of Concern:\n");
        boolean foundConcern = false;
        
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            double percentage = (entry.getValue() / data.totalIncome) * 100;
            if (percentage > 20 && !entry.getKey().equalsIgnoreCase("Food")) {
                response.append(String.format("• %s expenses: ₹%.0f (%.0f%% of income) - TOO HIGH\n", 
                    entry.getKey(), entry.getValue(), percentage));
                foundConcern = true;
            }
        }
        
        if (!foundConcern) {
            response.append("• Your spending appears well-balanced across categories\n");
        }
        
        response.append("\n✅ Well-managed Categories:\n");
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            double percentage = (entry.getValue() / data.totalIncome) * 100;
            if (percentage <= 20) {
                response.append(String.format("• %s expenses: ₹%.0f (%.0f%% of income) - REASONABLE\n", 
                    entry.getKey(), entry.getValue(), percentage));
            }
        }
        
        response.append("\n🎯 Recommendations:\n");
        response.append(String.format("• Current surplus: ₹%.0f/month\n", data.netBalance));
        response.append("• Focus on maintaining balanced spending\n");
        response.append("• Consider increasing savings if possible\n");
        
        return response.toString();
    }
    
    private String getSavingPlanResponse(String context) {
        FinancialData data = parseFinancialContext(context);
        
        StringBuilder response = new StringBuilder();
        response.append("💰 Personalized Saving Plan\n\n");
        
        response.append("📈 Current Position:\n");
        response.append(String.format("• Monthly income: ₹%.0f\n", data.totalIncome));
        response.append(String.format("• Monthly expenses: ₹%.0f\n", data.totalExpenses));
        response.append(String.format("• Monthly surplus: ₹%.0f\n", data.netBalance));
        
        double emergencyFund = data.netBalance * 0.4; // 40% for emergency
        double investments = data.netBalance * 0.4;   // 40% for investments
        double discretionary = data.netBalance * 0.2; // 20% for goals
        
        response.append("\n🎯 Recommended Allocation:\n");
        response.append(String.format("• Emergency Fund (40%): ₹%.0f/month\n", emergencyFund));
        response.append(String.format("  - Target: ₹%.0f (6 months expenses)\n", data.totalExpenses * 6));
        
        response.append(String.format("• Investments (40%): ₹%.0f/month\n", investments));
        response.append(String.format("  - SIP in equity funds: ₹%.0f\n", investments * 0.7));
        response.append(String.format("  - PPF contribution: ₹%.0f\n", investments * 0.3));
        
        response.append(String.format("• Goals/Discretionary (20%): ₹%.0f/month\n", discretionary));
        
        int emergencyMonths = (int) Math.ceil((data.totalExpenses * 6) / emergencyFund);
        response.append("\n⏰ Timeline:\n");
        response.append(String.format("• Emergency fund ready in %d months\n", emergencyMonths));
        response.append("• ₹10 lakh corpus in ~10 years through SIP\n");
        
        return response.toString();
    }
    
    private String getInvestmentAdvice(String context) {
        FinancialData data = parseFinancialContext(context);
        
        StringBuilder response = new StringBuilder();
        response.append("📈 Investment Strategy for You\n\n");
        
        double availableForInvestment = data.netBalance * 0.6; // 60% of surplus
        
        response.append(String.format("💵 Available for Investment: ₹%.0f/month\n\n", availableForInvestment));
        
        double sipAmount = availableForInvestment * 0.6;
        double ppfAmount = availableForInvestment * 0.3;
        double elssAmount = availableForInvestment * 0.1;
        
        response.append("📊 Recommended Portfolio:\n");
        response.append(String.format("• **SIP in Large Cap Funds:** ₹%.0f/month\n", sipAmount));
        response.append("  - Expected return: 12% annually\n");
        response.append(String.format("  - 10-year value: ₹%.0f lakhs\n", (sipAmount * 12 * 10 * 1.12) / 100000));
        
        response.append(String.format("• **PPF (Tax Saving):** ₹%.0f/month\n", ppfAmount));
        response.append("  - Tax benefit under 80C\n");
        response.append("  - 15-year maturity with tax-free returns\n");
        
        if (elssAmount > 500) {
            response.append(String.format("• **ELSS Funds:** ₹%.0f/month\n", elssAmount));
            response.append("  - Additional tax saving\n");
            response.append("  - 3-year lock-in period\n");
        }
        
        response.append("\n🚀 Action Steps:\n");
        response.append("• Open SIP with any major AMC (HDFC, ICICI, SBI)\n");
        response.append("• Start PPF account in bank or post office\n");
        response.append("• Use apps like Groww, Zerodha for easy investing\n");
        
        return response.toString();
    }
    
    private String getBudgetPlanResponse(String context) {
        FinancialData data = parseFinancialContext(context);
        
        StringBuilder response = new StringBuilder();
        response.append("📋 Monthly Budget Plan\n\n");
        
        response.append(String.format("💰 Income: ₹%.0f\n\n", data.totalIncome));
        
        double expensePercentage = (data.totalExpenses / data.totalIncome) * 100;
        double savingsPercentage = (data.netBalance / data.totalIncome) * 100;
        
        response.append(String.format("💸 Current Expenses (%.0f%%): ₹%.0f\n\n", expensePercentage, data.totalExpenses));
        
        // Show actual categories from transactions
        Map<String, Double> categoryTotals = new java.util.HashMap<>();
        for (String transaction : data.transactions) {
            if (transaction.contains("(") && transaction.contains(")")) {
                String categoryPart = transaction.substring(transaction.indexOf("(") + 1, transaction.indexOf(")"));
                String[] categoryWords = categoryPart.split(" - ");
                String category = categoryWords[0].trim();
                double amount = extractAmount(transaction);
                if (amount > 0) {
                    categoryTotals.put(category, categoryTotals.getOrDefault(category, 0.0) + amount);
                }
            }
        }
        
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            response.append(String.format("• %s: ₹%.0f\n", entry.getKey(), entry.getValue()));
        }
        
        response.append(String.format("\n💰 Savings & Investments (%.0f%%): ₹%.0f\n\n", savingsPercentage, data.netBalance));
        response.append(String.format("• Emergency fund: ₹%.0f\n", data.netBalance * 0.4));
        response.append(String.format("• Investments: ₹%.0f\n", data.netBalance * 0.6));
        
        response.append("\n📱 Budget Tracking Tips:\n");
        response.append("• Use apps like Money Manager, Walnut\n");
        response.append("• Review weekly spending\n");
        response.append("• Set category-wise limits\n");
        response.append("• Track via UPI transaction history\n");
        
        return response.toString();
    }
    
    private FinancialData parseFinancialContext(String context) {
        FinancialData data = new FinancialData();
        
        if (context != null) {
            // Extract total income
            if (context.contains("Total Income:")) {
                String incomeStr = context.substring(context.indexOf("Total Income:") + 13);
                incomeStr = incomeStr.substring(0, incomeStr.indexOf("\n")).replace("₹", "").replace("?", "").trim();
                data.totalIncome = Double.parseDouble(incomeStr);
            }
            
            // Extract total expenses
            if (context.contains("Total Expenses:")) {
                String expenseStr = context.substring(context.indexOf("Total Expenses:") + 15);
                expenseStr = expenseStr.substring(0, expenseStr.indexOf("\n")).replace("₹", "").replace("?", "").trim();
                data.totalExpenses = Double.parseDouble(expenseStr);
            }
            
            // Extract net balance
            if (context.contains("Net Balance:")) {
                String balanceStr = context.substring(context.indexOf("Net Balance:") + 12);
                balanceStr = balanceStr.substring(0, balanceStr.indexOf("\n")).replace("₹", "").replace("?", "").trim();
                data.netBalance = Double.parseDouble(balanceStr);
            }
            
            // Extract transactions
            if (context.contains("Transaction Details:")) {
                String transactionSection = context.substring(context.indexOf("Transaction Details:") + 20);
                String[] lines = transactionSection.split("\n");
                for (String line : lines) {
                    if (line.trim().startsWith("-")) {
                        data.transactions.add(line.trim().substring(1).trim());
                    }
                }
            }
        }
        
        return data;
    }
    
    private double extractAmount(String transaction) {
        try {
            // Look for ₹ or ? symbol
            int startIndex = -1;
            if (transaction.contains("₹")) {
                startIndex = transaction.indexOf("₹") + 1;
            } else if (transaction.contains("?")) {
                startIndex = transaction.indexOf("?") + 1;
            }
            
            if (startIndex > 0) {
                int endIndex = transaction.indexOf(" (", startIndex);
                if (endIndex == -1) endIndex = transaction.length();
                
                String amountStr = transaction.substring(startIndex, endIndex);
                amountStr = amountStr.replace("?", "").replace(",", "").replace("₹", "").trim();
                return Double.parseDouble(amountStr);
            }
            return 0.0;
        } catch (Exception e) {
            log.debug("Error extracting amount from: {}", transaction);
            return 0.0;
        }
    }
    
    private static class FinancialData {
        double totalIncome = 0;
        double totalExpenses = 0;
        double netBalance = 0;
        java.util.List<String> transactions = new java.util.ArrayList<>();
    }

    private AIInsightResponse parseResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String aiResponse = jsonNode.get("response").asText();
            
            log.info("AI response length: {} characters", aiResponse.length());
            log.debug("AI response content: {}", aiResponse);
            
            // Decode HTML entities in the AI response
            aiResponse = decodeHtmlEntities(aiResponse);
            
            // Extract category from response content
            String category = extractCategory(aiResponse);
            
            // Split response into insight and recommendation if possible
            String[] parts = splitResponse(aiResponse);
            
            return AIInsightResponse.builder()
                    .insight(parts[0])
                    .category(category)
                    .recommendation(parts[1])
                    .build();
                    
        } catch (Exception e) {
            log.error("Error parsing AI response: ", e);
            return AIInsightResponse.builder()
                    .insight("AI analysis completed")
                    .category("General")
                    .recommendation("Review your financial data regularly.")
                    .build();
        }
    }
    
    private String extractCategory(String response) {
        String lower = response.toLowerCase();
        if (lower.contains("saving") || lower.contains("save")) return "Saving";
        if (lower.contains("spending") || lower.contains("expense")) return "Spending";
        if (lower.contains("budget")) return "Budget";
        if (lower.contains("invest") || lower.contains("sip") || lower.contains("ppf")) return "Investment";
        if (lower.contains("debt") || lower.contains("loan")) return "Debt Management";
        return "General";
    }
    
    private String decodeHtmlEntities(String text) {
        if (text == null) return null;
        
        return text
            // Named entities
            .replace("&gt;", ">")
            .replace("&lt;", "<")
            .replace("&amp;", "&")
            .replace("&quot;", "\"")
            .replace("&apos;", "'")
            .replace("&nbsp;", " ")
            // Numeric entities
            .replace("&#39;", "'")
            .replace("&#x27;", "'")
            .replace("&#34;", "\"")
            .replace("&#x22;", "\"")
            .replace("&#38;", "&")
            .replace("&#60;", "<")
            .replace("&#62;", ">")
            // Common numeric codes
            .replace("&#8217;", "'")
            .replace("&#8220;", "\"")
            .replace("&#8221;", "\"")
            .replace("&#8230;", "...");
    }
    
    private String[] splitResponse(String response) {
        // HTML entities should already be decoded in parseResponse
        response = decodeHtmlEntities(response);
        
        // For financial advice, keep the full response as insight
        // and provide a generic recommendation
        if (response.length() > 50) {
            return new String[]{response.trim(), "Review and implement these financial strategies for better money management."};
        }
        
        // Fallback for short responses
        return new String[]{response.trim(), "Consider these suggestions for improved financial health."};
    }
}