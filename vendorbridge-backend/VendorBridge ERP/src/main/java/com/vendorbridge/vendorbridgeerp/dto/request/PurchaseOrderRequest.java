package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderRequest {
    private String poNumber;
    private Long vendorId;
    private Long quotationId;
    private String currency;
    private BigDecimal subTotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String paymentTerms;
    private String deliveryAddress;
    private String termsAndConditions;
    private String notes;
}
