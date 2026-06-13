package com.vendorbridge.vendorbridgeerp;

import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class VendorBridgeErpApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void printUsers() {
        System.out.println("--- DB USERS LIST START ---");
        userRepository.findAll().forEach(user -> {
            System.out.println("User ID: " + user.getId() + ", Email: " + user.getEmail() + ", Name: " + user.getFirstName() + " " + user.getLastName() + ", Role: " + (user.getRole() != null ? user.getRole().getRoleType() : "null"));
        });
        System.out.println("--- DB USERS LIST END ---");
    }
}
