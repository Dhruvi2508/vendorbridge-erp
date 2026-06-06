package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.Rfq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RfqRepository extends JpaRepository<Rfq, Long> {
    Optional<Rfq> findByRfqNumber(String rfqNumber);
}
