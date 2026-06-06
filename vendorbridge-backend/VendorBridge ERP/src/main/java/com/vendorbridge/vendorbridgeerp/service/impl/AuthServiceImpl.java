package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.LoginRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RegisterRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RefreshTokenRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.AuthResponse;
import com.vendorbridge.vendorbridgeerp.dto.response.RefreshTokenResponse;
import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.enums.UserStatus;
import com.vendorbridge.vendorbridgeerp.repository.RoleRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import com.vendorbridge.vendorbridgeerp.security.CustomUserDetailsService;
import com.vendorbridge.vendorbridgeerp.security.JwtService;
import com.vendorbridge.vendorbridgeerp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

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
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(UserStatus.ACTIVE)
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String roleName = role.getRoleType().name();

        String accessToken = jwtService.generateToken(userDetails, savedUser.getId(), savedUser.getEmail(), roleName);
        String refreshToken = jwtService.generateRefreshToken(userDetails, savedUser.getId(), savedUser.getEmail(), roleName);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(roleName)
                .message("Registration successful")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : null;

        String accessToken = jwtService.generateToken(userDetails, user.getId(), user.getEmail(), roleName);
        String refreshToken = jwtService.generateRefreshToken(userDetails, user.getId(), user.getEmail(), roleName);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(roleName)
                .message("Login successful")
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                User user = userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : null;

                String newAccessToken = jwtService.generateToken(userDetails, user.getId(), user.getEmail(), roleName);
                String newRefreshToken = jwtService.generateRefreshToken(userDetails, user.getId(), user.getEmail(), roleName);

                return RefreshTokenResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .tokenType("Bearer")
                        .build();
            }
        }
        throw new IllegalArgumentException("Invalid refresh token");
    }

    @Override
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : null;

        return AuthResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(roleName)
                .message("Current user profile retrieved successfully")
                .build();
    }
}
