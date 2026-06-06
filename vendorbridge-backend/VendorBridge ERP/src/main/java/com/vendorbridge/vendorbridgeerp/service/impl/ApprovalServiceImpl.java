package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.ApprovalActionRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.ApprovalResponse;
import com.vendorbridge.vendorbridgeerp.entity.Approval;
import com.vendorbridge.vendorbridgeerp.enums.ApprovalStatus;
import com.vendorbridge.vendorbridgeerp.repository.ApprovalRepository;
import com.vendorbridge.vendorbridgeerp.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalServiceImpl implements ApprovalService {

    private final ApprovalRepository approvalRepository;

    @Override
    @Transactional
    public ApprovalResponse approve(ApprovalActionRequest request) {
        Approval approval = approvalRepository.findById(request.getApprovalId())
                .orElseThrow(() -> new IllegalArgumentException("Approval not found with id: " + request.getApprovalId()));

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setApprovedAt(LocalDateTime.now());
        approval.setRemarks(request.getRemarks());

        Approval saved = approvalRepository.save(approval);
        return mapToApprovalResponse(saved);
    }

    @Override
    @Transactional
    public ApprovalResponse reject(ApprovalActionRequest request) {
        Approval approval = approvalRepository.findById(request.getApprovalId())
                .orElseThrow(() -> new IllegalArgumentException("Approval not found with id: " + request.getApprovalId()));

        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setRejectedAt(LocalDateTime.now());
        approval.setRemarks(request.getRemarks());

        Approval saved = approvalRepository.save(approval);
        return mapToApprovalResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalResponse> getPendingApprovals() {
        List<Approval> pending = approvalRepository.findByStatus(ApprovalStatus.PENDING);
        return pending.stream()
                .map(this::mapToApprovalResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApprovalResponse> getApprovalHistory() {
        List<Approval> history = approvalRepository.findAllByOrderByCreatedAtDesc();
        return history.stream()
                .map(this::mapToApprovalResponse)
                .toList();
    }

    private ApprovalResponse mapToApprovalResponse(Approval approval) {
        return ApprovalResponse.builder()
                .id(approval.getId())
                .approvalLevel(approval.getApprovalLevel())
                .entityType(approval.getEntityType())
                .entityId(approval.getEntityId())
                .approverId(approval.getApprover() != null ? approval.getApprover().getId() : null)
                .status(approval.getStatus() != null ? approval.getStatus().name() : null)
                .remarks(approval.getRemarks())
                .approvedAt(approval.getApprovedAt())
                .rejectedAt(approval.getRejectedAt())
                .build();
    }
}
