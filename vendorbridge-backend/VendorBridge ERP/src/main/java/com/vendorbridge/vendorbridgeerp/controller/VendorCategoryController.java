package com.vendorbridge.vendorbridgeerp.controller;

import com.vendorbridge.vendorbridgeerp.dto.request.VendorCategoryRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorCategoryResponse;
import com.vendorbridge.vendorbridgeerp.service.VendorCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-categories")
@RequiredArgsConstructor
public class VendorCategoryController {

    private final VendorCategoryService vendorCategoryService;

    @PostMapping
    public ResponseEntity<VendorCategoryResponse> createCategory(@Valid @RequestBody VendorCategoryRequest request) {
        VendorCategoryResponse response = vendorCategoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VendorCategoryResponse>> getAllCategories() {
        List<VendorCategoryResponse> categories = vendorCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
