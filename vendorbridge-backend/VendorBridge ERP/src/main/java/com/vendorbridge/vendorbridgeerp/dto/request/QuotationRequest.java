package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationRequest {
    private String quotationNumber;
    private Long rfqId;
    private Long vendorId;
    private String currency;
    private BigDecimal subTotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private Integer deliveryDays;
    private String paymentTerms;
    private String notes;
    private List<QuotationItemRequest> items;
}
