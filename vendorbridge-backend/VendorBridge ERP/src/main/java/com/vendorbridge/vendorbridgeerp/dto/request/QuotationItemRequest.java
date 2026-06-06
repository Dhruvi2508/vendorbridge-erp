package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationItemRequest {
    private String itemName;
    private String itemCode;
    private String description;
    private BigDecimal quantity;
    private String unitOfMeasure;
    private BigDecimal unitPrice;
    private BigDecimal taxRate;
    private BigDecimal taxAmount;
    private BigDecimal discountRate;
    private BigDecimal discountAmount;
    private BigDecimal totalPrice;
    private Integer deliveryDays;
    private Integer sequenceNumber;
    private Long rfqItemId;
}
