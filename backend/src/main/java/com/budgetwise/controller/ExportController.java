package com.budgetwise.controller;

import com.budgetwise.service.ExportService;
import com.budgetwise.service.SimpleExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ExportController {

    private final ExportService exportService;
    private final SimpleExportService simpleExportService;

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf(@RequestParam(defaultValue = "all") String sections) {
        try {
            System.out.println("PDF export requested for sections: " + sections);
            byte[] pdfData = exportService.exportToPdf(sections);
            
            String filename = "financial-report-" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + ".pdf";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfData);
        } catch (Exception e) {
            System.err.println("PDF export error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportToCsv(@RequestParam(defaultValue = "all") String sections) {
        try {
            String csvData = simpleExportService.exportToCsv(sections);
            
            String filename = "financial-data-" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + ".csv";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csvData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/html")
    public ResponseEntity<String> exportToHtml(@RequestParam(defaultValue = "all") String sections) {
        try {
            String htmlData = simpleExportService.exportToHtml(sections);
            
            String filename = "financial-report-" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + ".html";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}