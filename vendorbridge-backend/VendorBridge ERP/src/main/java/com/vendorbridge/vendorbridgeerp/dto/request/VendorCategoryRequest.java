package com.vendorbridge.vendorbridgeerp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    private String description;
}
