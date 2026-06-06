package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.LoginRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RegisterRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
