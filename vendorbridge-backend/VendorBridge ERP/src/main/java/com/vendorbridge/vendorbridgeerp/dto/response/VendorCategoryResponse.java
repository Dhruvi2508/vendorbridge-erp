package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorCategoryResponse {
    private Long id;
    private String categoryName;
    private String description;
}
