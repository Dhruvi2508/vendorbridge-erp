package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.VendorRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorResponse;

import java.util.List;

public interface VendorService {
    VendorResponse createVendor(VendorRequest request);
    List<VendorResponse> getAllVendors();
    VendorResponse getVendorById(Long id);
    VendorResponse updateVendor(Long id, VendorRequest request);
    void deleteVendor(Long id);
}
