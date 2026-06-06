package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderResponse {
    private Long id;
    private String poNumber;
    private Long vendorId;
    private Long quotationId;
    private BigDecimal totalAmount;
    private String status;
}
