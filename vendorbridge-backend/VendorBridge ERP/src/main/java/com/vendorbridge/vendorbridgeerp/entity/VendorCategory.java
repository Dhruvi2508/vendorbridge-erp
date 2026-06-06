package com.vendorbridge.vendorbridgeerp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "description", length = 255)
    private String description;
}