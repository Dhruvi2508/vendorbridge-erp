package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalActionRequest {
    private Long approvalId;
    private String remarks;
}
