package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.Approval;
import com.vendorbridge.vendorbridgeerp.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByStatus(ApprovalStatus status);
    List<Approval> findByApproverId(Long approverId);
    List<Approval> findAllByOrderByCreatedAtDesc();
}
