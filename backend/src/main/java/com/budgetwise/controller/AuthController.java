package com.budgetwise.controller;

import com.budgetwise.dto.LoginRequest;
import com.budgetwise.dto.RegisterRequest;
import com.budgetwise.dto.AuthResponse;
import com.budgetwise.dto.AuthRequest;
import com.budgetwise.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmailOrUsername(request.getIdentifier());
            authRequest.setPassword(request.getPassword());
            return ResponseEntity.ok(authService.authenticate(authRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return ResponseEntity.ok().build();
    }
}