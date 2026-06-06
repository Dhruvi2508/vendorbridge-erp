package com.vendorbridge.vendorbridgeerp.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqAttachmentRequest {
    private String fileName;
    private String filePath;
    private String description;
}
