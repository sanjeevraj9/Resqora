package org.resqora.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.resqora.dto.request.UpdateUserProfileRequest;
import org.resqora.dto.response.UserProfileResponse;
import org.resqora.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                userService.getProfile(authentication.getName())
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateUserProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                userService.updateProfile(
                        request,
                        authentication.getName()
                )
        );
    }
}