package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.request.VendorRequest;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorCategoryResponse;
import com.vendorbridge.vendorbridgeerp.dto.response.VendorResponse;
import com.vendorbridge.vendorbridgeerp.entity.Vendor;
import com.vendorbridge.vendorbridgeerp.entity.VendorCategory;
import com.vendorbridge.vendorbridgeerp.repository.VendorCategoryRepository;
import com.vendorbridge.vendorbridgeerp.repository.VendorRepository;
import com.vendorbridge.vendorbridgeerp.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final VendorCategoryRepository vendorCategoryRepository;

    @Override
    public VendorResponse createVendor(VendorRequest request) {
        if (vendorRepository.existsByVendorCode(request.getVendorCode())) {
            throw new IllegalArgumentException("Vendor code already exists: " + request.getVendorCode());
        }
        if (vendorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        VendorCategory category = vendorCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));

        Vendor vendor = Vendor.builder()
                .vendorCode(request.getVendorCode())
                .companyName(request.getCompanyName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .alternatePhone(request.getAlternatePhone())
                .website(request.getWebsite())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .taxId(request.getTaxId())
                .gstNumber(request.getGstNumber())
                .panNumber(request.getPanNumber())
                .bankName(request.getBankName())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfscCode(request.getBankIfscCode())
                .status(request.getStatus())
                .rating(request.getRating())
                .notes(request.getNotes())
                .category(category)
                .build();

        Vendor savedVendor = vendorRepository.save(vendor);
        return mapToResponse(savedVendor);
    }

    @Override
    public List<VendorResponse> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with ID: " + id));
        return mapToResponse(vendor);
    }

    @Override
    public VendorResponse updateVendor(Long id, VendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with ID: " + id));

        if (!vendor.getVendorCode().equals(request.getVendorCode()) && vendorRepository.existsByVendorCode(request.getVendorCode())) {
            throw new IllegalArgumentException("Vendor code already exists: " + request.getVendorCode());
        }
        if (!vendor.getEmail().equals(request.getEmail()) && vendorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        VendorCategory category = vendorCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.getCategoryId()));

        vendor.setVendorCode(request.getVendorCode());
        vendor.setCompanyName(request.getCompanyName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setAlternatePhone(request.getAlternatePhone());
        vendor.setWebsite(request.getWebsite());
        vendor.setAddress(request.getAddress());
        vendor.setCity(request.getCity());
        vendor.setState(request.getState());
        vendor.setCountry(request.getCountry());
        vendor.setPostalCode(request.getPostalCode());
        vendor.setTaxId(request.getTaxId());
        vendor.setGstNumber(request.getGstNumber());
        vendor.setPanNumber(request.getPanNumber());
        vendor.setBankName(request.getBankName());
        vendor.setBankAccountNumber(request.getBankAccountNumber());
        vendor.setBankIfscCode(request.getBankIfscCode());
        vendor.setStatus(request.getStatus());
        vendor.setRating(request.getRating());
        vendor.setNotes(request.getNotes());
        vendor.setCategory(category);

        Vendor updatedVendor = vendorRepository.save(vendor);
        return mapToResponse(updatedVendor);
    }

    @Override
    public void deleteVendor(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new IllegalArgumentException("Vendor not found with ID: " + id);
        }
        vendorRepository.deleteById(id);
    }

    private VendorResponse mapToResponse(Vendor vendor) {
        VendorCategoryResponse categoryResponse = null;
        if (vendor.getCategory() != null) {
            categoryResponse = VendorCategoryResponse.builder()
                    .id(vendor.getCategory().getId())
                    .categoryName(vendor.getCategory().getCategoryName())
                    .description(vendor.getCategory().getDescription())
                    .build();
        }

        return VendorResponse.builder()
                .id(vendor.getId())
                .vendorCode(vendor.getVendorCode())
                .companyName(vendor.getCompanyName())
                .contactPerson(vendor.getContactPerson())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .alternatePhone(vendor.getAlternatePhone())
                .website(vendor.getWebsite())
                .address(vendor.getAddress())
                .city(vendor.getCity())
                .state(vendor.getState())
                .country(vendor.getCountry())
                .postalCode(vendor.getPostalCode())
                .taxId(vendor.getTaxId())
                .gstNumber(vendor.getGstNumber())
                .panNumber(vendor.getPanNumber())
                .bankName(vendor.getBankName())
                .bankAccountNumber(vendor.getBankAccountNumber())
                .bankIfscCode(vendor.getBankIfscCode())
                .status(vendor.getStatus())
                .rating(vendor.getRating())
                .notes(vendor.getNotes())
                .category(categoryResponse)
                .build();
    }
}
