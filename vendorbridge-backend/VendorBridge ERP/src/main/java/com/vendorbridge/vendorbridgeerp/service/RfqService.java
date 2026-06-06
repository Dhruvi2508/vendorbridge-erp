package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.RfqRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.AssignVendorRequest;
import com.vendorbridge.vendorbridgeerp.dto.request.RfqAttachmentRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.RfqResponse;

import java.util.List;

public interface RfqService {
    RfqResponse createRfq(RfqRequest request);
    List<RfqResponse> getAllRfqs();
    RfqResponse getRfqById(Long id);
    RfqResponse updateRfq(Long id, RfqRequest request);
    void deleteRfq(Long id);
    RfqResponse assignVendor(Long rfqId, AssignVendorRequest request);
    RfqResponse addAttachment(Long rfqId, RfqAttachmentRequest request);
}
