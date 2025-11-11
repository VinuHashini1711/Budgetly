package com.budgetwise.service;

import com.budgetwise.dto.UpdateProfileRequest;
import com.budgetwise.dto.UserProfileDTO;
import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieves the currently authenticated user based on the identifier
     * (can be either email or username from the SecurityContext).
     */
    private User getCurrentUser() {
        String identifier = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Returns the user’s profile details.
     */
    public UserProfileDTO getUserProfile() {
        User user = getCurrentUser();
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImage() != null
                        ? "/api/profile/avatar/" + user.getProfileImage()
                        : null)
                .build();
    }

    /**
     * Updates user profile details such as username or password.
     */
    public UserProfileDTO updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        // Update username if provided
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            if (userRepository.existsByUsername(request.getUsername()) &&
                    !request.getUsername().equals(user.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        // Handle password update
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null ||
                    !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        user = userRepository.save(user);

        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImage() != null
                        ? "/api/profile/avatar/" + user.getProfileImage()
                        : null)
                .build();
    }

    /**
     * Uploads or updates a user’s profile image.
     */
    public UserProfileDTO uploadProfileImage(MultipartFile file) {
        User user = getCurrentUser();

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("No file uploaded");
        }

        try {
            Path uploadDir = Paths.get("uploads").toAbsolutePath();
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String original = Objects.requireNonNull(file.getOriginalFilename())
                    .replaceAll("[^a-zA-Z0-9.\\-_]", "_");

            String filename = user.getId() + "_" + Instant.now().toEpochMilli() + "_" + original;
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target);

            user.setProfileImage(filename);
            userRepository.save(user);

            return UserProfileDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .profileImageUrl("/api/profile/avatar/" + filename)
                    .build();

        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
}
