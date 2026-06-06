package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqRequest {
    private String rfqNumber;
    private String title;
    private String description;
    private LocalDate issueDate;
    private LocalDate submissionDeadline;
    private LocalDate deliveryDate;
    private String deliveryAddress;
    private String termsAndConditions;
    private String notes;
}
