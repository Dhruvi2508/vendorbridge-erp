package com.vendorbridge.vendorbridgeerp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rfq_vendors",
        uniqueConstraints = @UniqueConstraint(columnNames = {"rfq_id", "vendor_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfqVendor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_id", nullable = false)
    private Rfq rfq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "invited_at")
    private LocalDateTime invitedAt;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Builder.Default
    @Column(name = "is_acknowledged")
    private Boolean acknowledged = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
