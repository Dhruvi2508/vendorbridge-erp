package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.RfqVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RfqVendorRepository extends JpaRepository<RfqVendor, Long> {
    List<RfqVendor> findByRfqId(Long rfqId);
}
