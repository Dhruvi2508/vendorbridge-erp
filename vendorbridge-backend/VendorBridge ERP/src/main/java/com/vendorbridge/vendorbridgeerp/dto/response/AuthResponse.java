package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String role;
    private String message;
}
