package com.vendorbridge.vendorbridgeerp.config;

import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.enums.RoleType;
import com.vendorbridge.vendorbridgeerp.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (RoleType roleType : RoleType.values()) {
            roleRepository.findByRoleType(roleType)
                    .orElseGet(() -> roleRepository.save(
                            Role.builder()
                                    .roleType(roleType)
                                    .description(roleType.name())
                                    .build()
                    ));
        }
    }
}
