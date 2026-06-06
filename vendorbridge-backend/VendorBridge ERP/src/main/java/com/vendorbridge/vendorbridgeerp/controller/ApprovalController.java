package com.vendorbridge.vendorbridgeerp.controller;

import com.vendorbridge.vendorbridgeerp.dto.request.ApprovalActionRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.ApprovalResponse;
import com.vendorbridge.vendorbridgeerp.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @PostMapping("/approve")
    public ResponseEntity<ApprovalResponse> approve(@RequestBody ApprovalActionRequest request) {
        ApprovalResponse response = approvalService.approve(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reject")
    public ResponseEntity<ApprovalResponse> reject(@RequestBody ApprovalActionRequest request) {
        ApprovalResponse response = approvalService.reject(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalResponse>> getPendingApprovals() {
        List<ApprovalResponse> responses = approvalService.getPendingApprovals();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ApprovalResponse>> getApprovalHistory() {
        List<ApprovalResponse> responses = approvalService.getApprovalHistory();
        return ResponseEntity.ok(responses);
    }
}
