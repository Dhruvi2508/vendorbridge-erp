package com.vendorbridge.vendorbridgeerp.dto.request;

import com.vendorbridge.vendorbridgeerp.enums.VendorStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequest {

    @NotBlank(message = "Vendor code is required")
    private String vendorCode;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String alternatePhone;
    private String website;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String taxId;
    private String gstNumber;
    private String panNumber;
    private String bankName;
    private String bankAccountNumber;
    private String bankIfscCode;

    @NotNull(message = "Vendor status is required")
    private VendorStatus status;

    private Double rating;
    private String notes;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
