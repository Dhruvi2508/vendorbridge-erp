package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.ApprovalActionRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.ApprovalResponse;

import java.util.List;

public interface ApprovalService {
    ApprovalResponse approve(ApprovalActionRequest request);
    ApprovalResponse reject(ApprovalActionRequest request);
    List<ApprovalResponse> getPendingApprovals();
    List<ApprovalResponse> getApprovalHistory();
}
