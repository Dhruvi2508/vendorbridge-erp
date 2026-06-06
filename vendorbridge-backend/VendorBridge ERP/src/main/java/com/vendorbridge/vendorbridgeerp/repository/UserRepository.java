package com.vendorbridge.vendorbridgeerp.repository;

import com.vendorbridge.vendorbridgeerp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN FETCH u.role WHERE u.email = :email")
    Optional<User> findByEmail(@org.springframework.data.repository.query.Param("email") String email);

    boolean existsByEmail(String email);
}
