package com.budgetwise.controller;

import com.budgetwise.dto.UpdateProfileRequest;
import com.budgetwise.dto.UserProfileDTO;
import com.budgetwise.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile() {
        return ResponseEntity.ok(profileService.getUserProfile());
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }
}