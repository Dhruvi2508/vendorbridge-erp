package com.vendorbridge.vendorbridgeerp.config;

import com.vendorbridge.vendorbridgeerp.security.JwtAuthEntryPoint;
import com.vendorbridge.vendorbridgeerp.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh-token", "/error").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/swagger-resources/**", "/webjars/**").permitAll()

                // Role-based authorization rules
                // 1. Read-only APIs for VIEWER and other authenticated roles
                .requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "PROCUREMENT_OFFICER", "APPROVER", "FINANCE", "VIEWER")

                // 2. PROCUREMENT_OFFICER specific endpoints (Vendor, RFQ, Quotation, Purchase Order)
                .requestMatchers("/api/vendors/**", "/api/vendor-categories/**", "/api/rfqs/**", "/api/quotations/**", "/api/purchase-orders/**")
                    .hasAnyRole("ADMIN", "PROCUREMENT_OFFICER")

                // 3. APPROVER specific endpoints
                .requestMatchers("/api/approvals/**").hasAnyRole("ADMIN", "APPROVER")

                // 4. FINANCE specific endpoints (Invoices)
                .requestMatchers("/api/invoices/**").hasAnyRole("ADMIN", "FINANCE")

                // 5. ADMIN full access (e.g. /api/users/** or general CRUD operations)
                .requestMatchers("/api/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}