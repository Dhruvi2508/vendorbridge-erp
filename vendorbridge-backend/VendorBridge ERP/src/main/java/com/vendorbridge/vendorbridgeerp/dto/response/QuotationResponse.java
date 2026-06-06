package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotationResponse {
    private Long id;
    private String quotationNumber;
    private Long rfqId;
    private Long vendorId;
    private BigDecimal totalAmount;
    private Integer deliveryDays;
    private String status;
}
