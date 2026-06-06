package com.vendorbridge.vendorbridgeerp.entity;

import com.vendorbridge.vendorbridgeerp.enums.QuotationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "quotations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quotation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quotation_number", nullable = false, unique = true, length = 50)
    private String quotationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QuotationStatus status;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "validity_date")
    private LocalDate validityDate;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "sub_total", precision = 19, scale = 4)
    private BigDecimal subTotal;

    @Column(name = "tax_amount", precision = 19, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "discount_amount", precision = 19, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "delivery_days")
    private Integer deliveryDays;

    @Column(name = "payment_terms", length = 255)
    private String paymentTerms;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_id", nullable = false)
    private Rfq rfq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @OneToMany(
            mappedBy = "quotation",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private Set<QuotationItem> quotationItems = new HashSet<>();
}