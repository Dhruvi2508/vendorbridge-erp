package com.vendorbridge.vendorbridgeerp.service.impl;

import com.vendorbridge.vendorbridgeerp.dto.response.UserResponse;
import com.vendorbridge.vendorbridgeerp.entity.Role;
import com.vendorbridge.vendorbridgeerp.entity.User;
import com.vendorbridge.vendorbridgeerp.enums.RoleType;
import com.vendorbridge.vendorbridgeerp.enums.UserStatus;
import com.vendorbridge.vendorbridgeerp.repository.RoleRepository;
import com.vendorbridge.vendorbridgeerp.repository.UserRepository;
import com.vendorbridge.vendorbridgeerp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserResponse request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getDepartment() != null) {
            user.setDepartment(request.getDepartment());
        }

        if (request.getStatus() != null) {
            user.setStatus(UserStatus.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getRole() != null) {
            RoleType roleType = RoleType.valueOf(request.getRole().toUpperCase());
            Role role = roleRepository.findByRoleType(roleType)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));
            user.setRole(role);
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToUserResponse(User user) {
        String roleName = user.getRole() != null ? user.getRole().getRoleType().name() : null;
        String statusName = user.getStatus() != null ? user.getStatus().name() : null;
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .department(user.getDepartment())
                .status(statusName)
                .role(roleName)
                .build();
    }
}
