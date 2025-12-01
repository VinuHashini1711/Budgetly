package com.budgetwise.controller;

import com.budgetwise.dto.LoginRequest;
import com.budgetwise.dto.RegisterRequest;
import com.budgetwise.dto.AuthResponse;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(com.budgetwise.model.Role.ROLE_USER);
            userRepository.save(user);
            
            return ResponseEntity.ok(AuthResponse.builder()
                .token("dummy-token")
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Registration successful")
                .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = userRepository.findByUsername(request.getIdentifier())
                .or(() -> userRepository.findByEmail(request.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid password");
            }
            
            return ResponseEntity.ok(AuthResponse.builder()
                .token("dummy-token")
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Login successful")
                .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(AuthResponse.builder().message(e.getMessage()).build());
        }
    }
}