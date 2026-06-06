package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleType(RoleType roleType);
}
