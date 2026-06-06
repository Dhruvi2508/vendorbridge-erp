package com.vendorbridge.vendorbridgeerp.controller;

import com.vendorbridge.vendorbridgeerp.dto.request.LoginRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RegisterRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RefreshTokenRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.AuthResponse;
import com.vendorbridge.vendorbridgeerp.dto.response.RefreshTokenResponse;
import com.vendorbridge.vendorbridgeerp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        AuthResponse response = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(response);
    }
}
