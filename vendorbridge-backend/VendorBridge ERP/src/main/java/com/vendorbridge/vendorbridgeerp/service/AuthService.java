package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.LoginRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RegisterRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RefreshTokenRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.AuthResponse;
import com.vendorbridge.vendorbridgeerp.dto.response.RefreshTokenResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
    AuthResponse getCurrentUser(String email);
}
