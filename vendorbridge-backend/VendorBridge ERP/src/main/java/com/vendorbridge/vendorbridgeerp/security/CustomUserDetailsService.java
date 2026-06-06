package com.vendorbridge.vendorbridgeerp.security;

import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {


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
        });
    }
}
