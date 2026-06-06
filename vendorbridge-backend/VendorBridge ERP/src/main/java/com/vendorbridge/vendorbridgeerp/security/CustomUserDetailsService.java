package com.vendorbridge.vendorbridgeerp.security;

import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : "VIEWER";

        boolean enabled = user.getStatus() == com.vendorbridge.vendorbridgeerp.enums.UserStatus.ACTIVE;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = user.getStatus() != com.vendorbridge.vendorbridgeerp.enums.UserStatus.LOCKED
                && user.getStatus() != com.vendorbridge.vendorbridgeerp.enums.UserStatus.SUSPENDED;

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                enabled,
                accountNonExpired,
                credentialsNonExpired,
                accountNonLocked,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}
