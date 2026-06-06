package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.LoginRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RegisterRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.AuthResponse;
import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.enums.UserStatus;
import com.vendorbridge.vendorbridgeerp.repository.RoleRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import com.vendorbridge.vendorbridgeerp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role role = roleRepository.findByRoleType(request.getRoleType())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRoleType()));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword()) // Plain text for now
                .phone(request.getPhone())
                .status(UserStatus.ACTIVE)
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .token("dummy-token-for-" + savedUser.getEmail())
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(role.getRoleType().name())
                .message("Registration successful")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : null;

        return AuthResponse.builder()
                .token("dummy-token-for-" + user.getEmail())
                .userId(user.getId())
                .email(user.getEmail())
                .role(roleName)
                .message("Login successful")
                .build();
    }
}
