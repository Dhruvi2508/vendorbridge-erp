package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String message;
}
