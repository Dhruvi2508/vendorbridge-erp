package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.VendorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorCategoryRepository extends JpaRepository<VendorCategory, Long> {
    Optional<VendorCategory> findByCategoryName(String categoryName);
    boolean existsByCategoryName(String categoryName);
}
