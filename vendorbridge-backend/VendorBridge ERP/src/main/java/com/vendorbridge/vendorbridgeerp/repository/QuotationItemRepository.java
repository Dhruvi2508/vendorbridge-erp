package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.QuotationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationItemRepository extends JpaRepository<QuotationItem, Long> {
    List<QuotationItem> findByQuotationId(Long quotationId);
}
