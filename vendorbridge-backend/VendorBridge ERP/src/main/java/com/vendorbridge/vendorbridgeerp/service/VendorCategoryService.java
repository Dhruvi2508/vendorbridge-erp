package com.vendorbridge.vendorbridgeerp.service;

import com.vendorbridge.vendorbridgeerp.dto.request.VendorCategoryRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorCategoryResponse;

import java.util.List;

public interface VendorCategoryService {
    VendorCategoryResponse createCategory(VendorCategoryRequest request);
    List<VendorCategoryResponse> getAllCategories();
}
