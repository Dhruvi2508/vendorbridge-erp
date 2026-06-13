package com.vendorbridge.vendorbridgeerp.config;

import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.enums.RoleType;
import com.vendorbridge.vendorbridgeerp.repository.RoleRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        // Ensure specific users have correct BCrypt hashed passwords and are ACTIVE
        userRepository.findByEmail("rahul123@gmail.com").ifPresent(user -> {
            user.setStatus(com.vendorbridge.vendorbridgeerp.enums.UserStatus.ACTIVE);
            if (!passwordEncoder.matches("Rahul@123", user.getPassword())) {
                user.setPassword(passwordEncoder.encode("Rahul@123"));
                userRepository.save(user);
                System.out.println("Set password for rahul123@gmail.com to BCrypt-encoded 'Rahul@123'");
            }
        });

        userRepository.findByEmail("om@gmail.com").ifPresent(user -> {
            user.setStatus(com.vendorbridge.vendorbridgeerp.enums.UserStatus.ACTIVE);
            if (!passwordEncoder.matches("123456", user.getPassword())) {
                user.setPassword(passwordEncoder.encode("123456"));
                userRepository.save(user);
                System.out.println("Set password for om@gmail.com to BCrypt-encoded '123456'");
            }
        });

        // For any other users, if their password is plain-text, BCrypt-encode it
        userRepository.findAll().forEach(user -> {
            String pw = user.getPassword();
            if (pw == null || (!pw.startsWith("$2a$") && !pw.startsWith("$2b$") && !pw.startsWith("$2y$"))) {
                String plainPassword = (pw == null || pw.trim().isEmpty()) ? "123456" : pw;
                user.setPassword(passwordEncoder.encode(plainPassword));
                userRepository.save(user);
                System.out.println("Auto-encoded plain text password for: " + user.getEmail());
            }
        });
    }
}

