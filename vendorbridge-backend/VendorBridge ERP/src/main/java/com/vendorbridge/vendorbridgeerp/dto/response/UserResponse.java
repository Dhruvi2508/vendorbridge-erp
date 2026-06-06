package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private String status;
    private String role;
}
