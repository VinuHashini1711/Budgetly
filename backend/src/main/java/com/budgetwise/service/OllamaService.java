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

    public OllamaService(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model,
                        @Value("${ollama.timeout}") int timeout) {
        this.model = model;
        this.objectMapper = new ObjectMapper();
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public AIInsightResponse generateInsight(AIInsightRequest request) {
        try {
            String prompt = buildPrompt(request);
            
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
            );

            String response = webClient.post()
                    .uri("/api/generate")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            return parseResponse(response);
            
        } catch (Exception e) {
            log.error("Error generating AI insight: ", e);
            return AIInsightResponse.builder()
                    .insight("Unable to generate AI insight at the moment.")
                    .category("Error")
                    .recommendation("Please try again later.")
                    .build();
        }
    }

    private String buildPrompt(AIInsightRequest request) {
        return String.format("""
            You are a financial advisor AI for BudgetwiseAI expense tracker in India. 
            Analyze the following financial data and provide insights:
            
            Query: %s
            Context: %s
            
            IMPORTANT: Always use Indian Rupees (₹) symbol, never use $ or USD.
            All amounts should be in INR currency format.
            
            Please provide:
            1. A clear financial insight
            2. Category of the insight (Spending, Saving, Budget, Investment)
            3. Actionable recommendation
            
            Keep responses concise and practical.
            """, request.getQuery(), request.getContext());
    }

    private AIInsightResponse parseResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String aiResponse = jsonNode.get("response").asText();
            
            // Simple parsing - you can enhance this
            return AIInsightResponse.builder()
                    .insight(aiResponse)
                    .category("General")
                    .recommendation("Follow the AI suggestions above.")
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
}