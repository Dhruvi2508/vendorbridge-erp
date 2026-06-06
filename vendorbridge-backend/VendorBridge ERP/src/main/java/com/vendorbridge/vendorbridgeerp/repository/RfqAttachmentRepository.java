package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.RfqAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RfqAttachmentRepository extends JpaRepository<RfqAttachment, Long> {
    List<RfqAttachment> findByRfqId(Long rfqId);
}
