package com.college.cms.service;

import com.college.cms.dto.LoginRequest;
import com.college.cms.dto.LoginResponse;
import com.college.cms.model.Admin;
import com.college.cms.repository.AdminRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public LoginResponse authenticate(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        boolean matches = passwordEncoder.matches(request.getPassword(), admin.getPassword())
                || request.getPassword().equals(admin.getPassword()); // Support initial password

        if (!matches) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = "TOKEN-" + UUID.randomUUID().toString();
        return new LoginResponse(token, admin.getUsername(), admin.getName(), admin.getEmail(), admin.getRole());
    }

    public LoginResponse register(com.college.cms.dto.RegisterRequest request) {
        if (adminRepository.findByUsername(request.getUsername().trim()).isPresent()) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword().trim());
        String role = (request.getRole() != null && !request.getRole().trim().isEmpty()) ? request.getRole().trim() : "Admin";

        Admin newAdmin = new Admin(
                request.getUsername().trim(),
                encodedPassword,
                request.getName().trim(),
                request.getEmail().trim(),
                role
        );

        Admin saved = adminRepository.save(newAdmin);
        String token = "TOKEN-" + UUID.randomUUID().toString();
        return new LoginResponse(token, saved.getUsername(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}
