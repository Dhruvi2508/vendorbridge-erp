package com.vendorbridge.vendorbridgeerp.dto.response;

import com.vendorbridge.vendorbridgeerp.enums.VendorStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {
    private Long id;
    private String vendorCode;
    private String companyName;
    private String contactPerson;
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
    private VendorStatus status;
    private Double rating;
    private String notes;
    private VendorCategoryResponse category;
}
