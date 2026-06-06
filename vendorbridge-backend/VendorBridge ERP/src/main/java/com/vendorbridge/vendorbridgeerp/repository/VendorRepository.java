package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByVendorCode(String vendorCode);
    List<Vendor> findByCompanyNameContainingIgnoreCase(String companyName);
    boolean existsByVendorCode(String vendorCode);
    boolean existsByEmail(String email);
}
