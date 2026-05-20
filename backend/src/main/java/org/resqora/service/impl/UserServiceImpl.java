package org.resqora.service.impl;

import lombok.RequiredArgsConstructor;
import org.resqora.dto.request.UpdateUserProfileRequest;
import org.resqora.dto.response.UserProfileResponse;
import org.resqora.entity.User;
import org.resqora.exception.ResourceNotFoundException;
import org.resqora.repository.UserRepository;
import org.resqora.service.UserService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return map(user);
    }

    @Override
    public UserProfileResponse updateProfile(
            UpdateUserProfileRequest request,
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());

        user.setEmergencyContactName(
                request.getEmergencyContactName()
        );

        user.setEmergencyContactPhone(
                request.getEmergencyContactPhone()
        );

        userRepository.save(user);

        return map(user);
    }

    private UserProfileResponse map(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .emergencyContactName(
                        user.getEmergencyContactName()
                )
                .emergencyContactPhone(
                        user.getEmergencyContactPhone()
                )
                .build();
    }
}