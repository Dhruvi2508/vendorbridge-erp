package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.VendorCategoryRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorCategoryResponse;
import com.vendorbridge.vendorbridgeerp.entity.VendorCategory;
import com.vendorbridge.vendorbridgeerp.repository.VendorCategoryRepository;
import com.vendorbridge.vendorbridgeerp.service.VendorCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorCategoryServiceImpl implements VendorCategoryService {

    private final VendorCategoryRepository vendorCategoryRepository;

    @Override
    public VendorCategoryResponse createCategory(VendorCategoryRequest request) {
        if (vendorCategoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new IllegalArgumentException("Category name already exists: " + request.getCategoryName());
        }

        VendorCategory category = VendorCategory.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .build();

        VendorCategory savedCategory = vendorCategoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Override
    public List<VendorCategoryResponse> getAllCategories() {
        return vendorCategoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private VendorCategoryResponse mapToResponse(VendorCategory category) {
        return VendorCategoryResponse.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .build();
    }
}
