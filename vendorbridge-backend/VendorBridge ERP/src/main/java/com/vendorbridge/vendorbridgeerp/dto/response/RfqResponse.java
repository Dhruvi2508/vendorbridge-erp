package com.vendorbridge.vendorbridgeerp.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqResponse {
    private Long id;
    private String rfqNumber;
    private String title;
    private String description;
    private String status;
}
