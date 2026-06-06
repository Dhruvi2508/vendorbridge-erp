package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.RfqRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.AssignVendorRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RfqAttachmentRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.RfqResponse;
import com.vendorbridge.vendorbridgeerp.entity.Rfq;
import com.vendorbridge.vendorbridgeerp.entity.RfqVendor;
import com.vendorbridge.vendorbridgeerp.entity.RfqAttachment;
import com.vendorbridge.vendorbridgeerp.entity.Vendor;
import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.enums.RfqStatus;
import com.vendorbridge.vendorbridgeerp.repository.RfqRepository;
import com.vendorbridge.vendorbridgeerp.repository.RfqVendorRepository;
import com.vendorbridge.vendorbridgeerp.repository.RfqAttachmentRepository;
import com.vendorbridge.vendorbridgeerp.repository.VendorRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import com.vendorbridge.vendorbridgeerp.service.RfqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RfqServiceImpl implements RfqService {

    private final RfqRepository rfqRepository;
    private final RfqVendorRepository rfqVendorRepository;
    private final RfqAttachmentRepository rfqAttachmentRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RfqResponse createRfq(RfqRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User creator = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("No users available to assign as RFQ creator")));

        Rfq rfq = Rfq.builder()
                .rfqNumber(request.getRfqNumber())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(RfqStatus.DRAFT)
                .issueDate(request.getIssueDate())
                .submissionDeadline(request.getSubmissionDeadline())
                .deliveryDate(request.getDeliveryDate())
                .deliveryAddress(request.getDeliveryAddress())
                .termsAndConditions(request.getTermsAndConditions())
                .notes(request.getNotes())
                .createdBy(creator)
                .build();

        Rfq saved = rfqRepository.save(rfq);
        return mapToRfqResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RfqResponse> getAllRfqs() {
        return rfqRepository.findAll().stream()
                .map(this::mapToRfqResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RfqResponse getRfqById(Long id) {
        Rfq rfq = rfqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("RFQ not found with id: " + id));
        return mapToRfqResponse(rfq);
    }

    @Override
    @Transactional
    public RfqResponse updateRfq(Long id, RfqRequest request) {
        Rfq rfq = rfqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("RFQ not found with id: " + id));

        rfq.setRfqNumber(request.getRfqNumber());
        rfq.setTitle(request.getTitle());
        rfq.setDescription(request.getDescription());
        rfq.setIssueDate(request.getIssueDate());
        rfq.setSubmissionDeadline(request.getSubmissionDeadline());
        rfq.setDeliveryDate(request.getDeliveryDate());
        rfq.setDeliveryAddress(request.getDeliveryAddress());
        rfq.setTermsAndConditions(request.getTermsAndConditions());
        rfq.setNotes(request.getNotes());

        Rfq updated = rfqRepository.save(rfq);
        return mapToRfqResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRfq(Long id) {
        if (!rfqRepository.existsById(id)) {
            throw new IllegalArgumentException("RFQ not found with id: " + id);
        }
        rfqRepository.deleteById(id);
    }

    @Override
    @Transactional
    public RfqResponse assignVendor(Long rfqId, AssignVendorRequest request) {
        Rfq rfq = rfqRepository.findById(rfqId)
                .orElseThrow(() -> new IllegalArgumentException("RFQ not found with id: " + rfqId));
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id: " + request.getVendorId()));

        RfqVendor rfqVendor = RfqVendor.builder()
                .rfq(rfq)
                .vendor(vendor)
                .invitedAt(LocalDateTime.now())
                .acknowledged(false)
                .build();

        rfqVendorRepository.save(rfqVendor);
        return mapToRfqResponse(rfq);
    }

    @Override
    @Transactional
    public RfqResponse addAttachment(Long rfqId, RfqAttachmentRequest request) {
        Rfq rfq = rfqRepository.findById(rfqId)
                .orElseThrow(() -> new IllegalArgumentException("RFQ not found with id: " + rfqId));

        RfqAttachment attachment = RfqAttachment.builder()
                .rfq(rfq)
                .fileName(request.getFileName())
                .originalFileName(request.getFileName())
                .filePath(request.getFilePath())
                .description(request.getDescription())
                .build();

        rfqAttachmentRepository.save(attachment);
        return mapToRfqResponse(rfq);
    }

    private RfqResponse mapToRfqResponse(Rfq rfq) {
        return RfqResponse.builder()
                .id(rfq.getId())
                .rfqNumber(rfq.getRfqNumber())
                .title(rfq.getTitle())
                .description(rfq.getDescription())
                .status(rfq.getStatus() != null ? rfq.getStatus().name() : null)
                .build();
    }
}
