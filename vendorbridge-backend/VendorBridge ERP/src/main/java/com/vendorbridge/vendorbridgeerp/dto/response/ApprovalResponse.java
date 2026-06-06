package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalResponse {
    private Long id;
    private Integer approvalLevel;
    private String entityType;
    private Long entityId;
    private Long approverId;
    private String status;
    private String remarks;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
}
