package com.budgetwise.service;

import com.budgetwise.dto.TransactionResponse;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.Font;
import com.itextpdf.text.BaseColor;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public byte[] exportToPdf(String sections) {
        try {
            User user = getCurrentUser();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
            Font subHeaderFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 10);

            document.add(new Paragraph("BudgetwiseAI - Financial Report", titleFont));
            document.add(new Paragraph("User: " + user.getUsername(), normalFont));
            document.add(new Paragraph("Generated: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            document.add(new Paragraph(" "));

            String[] sectionArray = sections.split(",");
            
            for (String section : sectionArray) {
                switch (section.trim()) {
                    case "dashboard":
                        addDashboardToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                    case "transactions":
                        addTransactionsToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                    case "budgets":
                        addBudgetsToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                    case "goals":
                        addGoalsToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                    case "ai-insights":
                        addAIInsightsToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                    case "all":
                        addDashboardToPdf(document, headerFont, subHeaderFont, normalFont);
                        addTransactionsToPdf(document, headerFont, subHeaderFont, normalFont);
                        addBudgetsToPdf(document, headerFont, subHeaderFont, normalFont);
                        addGoalsToPdf(document, headerFont, subHeaderFont, normalFont);
                        addAIInsightsToPdf(document, headerFont, subHeaderFont, normalFont);
                        break;
                }
            }

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            System.err.println("PDF generation error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }

    private void addDashboardToPdf(Document document, Font headerFont, Font subHeaderFont, Font normalFont) throws DocumentException {
        document.add(new Paragraph("DASHBOARD SUMMARY", headerFont));
        document.add(new Paragraph(" "));
        
        try {
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

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(60);
            summaryTable.addCell(new PdfPCell(new Paragraph("Metric", subHeaderFont)));
            summaryTable.addCell(new PdfPCell(new Paragraph("Amount", subHeaderFont)));
            summaryTable.addCell(new Paragraph("Total Income", normalFont));
            summaryTable.addCell(new Paragraph("₹" + totalIncome, normalFont));
            summaryTable.addCell(new Paragraph("Total Expenses", normalFont));
            summaryTable.addCell(new Paragraph("₹" + totalExpenses, normalFont));
            summaryTable.addCell(new Paragraph("Net Balance", normalFont));
            summaryTable.addCell(new Paragraph("₹" + totalIncome.subtract(totalExpenses), normalFont));
            summaryTable.addCell(new Paragraph("Total Transactions", normalFont));
            summaryTable.addCell(new Paragraph(String.valueOf(transactions.size()), normalFont));
            
            document.add(summaryTable);
            document.add(new Paragraph(" "));
            
            document.add(new Paragraph("Expense Category Breakdown:", subHeaderFont));
            java.util.Map<String, BigDecimal> categoryTotals = new java.util.HashMap<>();
            for (TransactionResponse t : transactions) {
                if ("EXPENSE".equalsIgnoreCase(t.getType())) {
                    categoryTotals.merge(t.getCategory(), t.getAmount(), BigDecimal::add);
                }
            }
            
            if (!categoryTotals.isEmpty()) {
                PdfPTable categoryTable = new PdfPTable(3);
                categoryTable.setWidthPercentage(80);
                categoryTable.addCell(new PdfPCell(new Paragraph("Category", subHeaderFont)));
                categoryTable.addCell(new PdfPCell(new Paragraph("Amount", subHeaderFont)));
                categoryTable.addCell(new PdfPCell(new Paragraph("Percentage", subHeaderFont)));
                
                for (java.util.Map.Entry<String, BigDecimal> entry : categoryTotals.entrySet()) {
                    double percentage = totalExpenses.compareTo(BigDecimal.ZERO) > 0 ? 
                        entry.getValue().divide(totalExpenses, 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue() : 0;
                    
                    categoryTable.addCell(new Paragraph(entry.getKey(), normalFont));
                    categoryTable.addCell(new Paragraph("₹" + entry.getValue(), normalFont));
                    categoryTable.addCell(new Paragraph(String.format("%.1f%%", percentage), normalFont));
                }
                
                document.add(categoryTable);
            } else {
                document.add(new Paragraph("No expense data available.", normalFont));
            }
            
            BigDecimal netBalance = totalIncome.subtract(totalExpenses);
            String healthStatus;
            if (netBalance.compareTo(BigDecimal.ZERO) > 0) {
                healthStatus = "HEALTHY - Positive balance: ₹" + netBalance;
            } else if (netBalance.compareTo(BigDecimal.ZERO) == 0) {
                healthStatus = "BALANCED - Income equals expenses";
            } else {
                healthStatus = "ATTENTION - Deficit: ₹" + netBalance.abs();
            }
            
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Financial Health: " + healthStatus, subHeaderFont));
            
        } catch (Exception e) {
            document.add(new Paragraph("Error loading dashboard data: " + e.getMessage(), normalFont));
        }
        
        document.add(new Paragraph(" "));
    }

    private void addTransactionsToPdf(Document document, Font headerFont, Font subHeaderFont, Font normalFont) throws DocumentException {
        document.add(new Paragraph("TRANSACTION DETAILS", headerFont));
        document.add(new Paragraph(" "));
        
        try {
            List<TransactionResponse> transactions = transactionService.getUserTransactions();
            
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            
            table.addCell(new PdfPCell(new Paragraph("Date", subHeaderFont)));
            table.addCell(new PdfPCell(new Paragraph("Description", subHeaderFont)));
            table.addCell(new PdfPCell(new Paragraph("Category", subHeaderFont)));
            table.addCell(new PdfPCell(new Paragraph("Type", subHeaderFont)));
            table.addCell(new PdfPCell(new Paragraph("Amount", subHeaderFont)));

            for (TransactionResponse t : transactions) {
                table.addCell(new Paragraph(t.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), normalFont));
                table.addCell(new Paragraph(t.getDescription(), normalFont));
                table.addCell(new Paragraph(t.getCategory(), normalFont));
                table.addCell(new Paragraph(t.getType(), normalFont));
                table.addCell(new Paragraph("₹" + t.getAmount(), normalFont));
            }

            document.add(table);
        } catch (Exception e) {
            document.add(new Paragraph("Error loading transaction data: " + e.getMessage(), normalFont));
        }
        
        document.add(new Paragraph(" "));
    }

    private void addBudgetsToPdf(Document document, Font headerFont, Font subHeaderFont, Font normalFont) throws DocumentException {
        document.add(new Paragraph("BUDGETS", headerFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Budget management features are available in the app.", normalFont));
        document.add(new Paragraph(" "));
    }

    private void addGoalsToPdf(Document document, Font headerFont, Font subHeaderFont, Font normalFont) throws DocumentException {
        document.add(new Paragraph("FINANCIAL GOALS", headerFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Goal tracking features are available in the app.", normalFont));
        document.add(new Paragraph(" "));
    }

    private void addAIInsightsToPdf(Document document, Font headerFont, Font subHeaderFont, Font normalFont) throws DocumentException {
        document.add(new Paragraph("AI FINANCIAL INSIGHTS", headerFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Spending Analysis:", subHeaderFont));
        document.add(new Paragraph("• Review your transaction patterns for potential savings", normalFont));
        document.add(new Paragraph("Budget Recommendations:", subHeaderFont));
        document.add(new Paragraph("• Create category-wise budgets based on spending history", normalFont));
        document.add(new Paragraph(" "));
    }

    public String exportToCsv(String sections) {
        try {
            List<TransactionResponse> transactions = transactionService.getUserTransactions();
            
            StringWriter stringWriter = new StringWriter();
            CSVWriter csvWriter = new CSVWriter(stringWriter);

            String[] header = {"Date", "Description", "Category", "Type", "Amount", "Payment Method"};
            csvWriter.writeNext(header);

            for (TransactionResponse t : transactions) {
                String[] data = {
                    t.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),
                    t.getDescription(),
                    t.getCategory(),
                    t.getType(),
                    t.getAmount().toString(),
                    t.getPaymentMethod()
                };
                csvWriter.writeNext(data);
            }

            csvWriter.close();
            return stringWriter.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
}