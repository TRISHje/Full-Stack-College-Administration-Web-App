package com.CAMS.app.Models.DAO.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Import the PasswordEncoder interface
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.CAMS.app.Models.DTO.*;
import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Models.Repositories.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // Autowire the PasswordEncoder bean

    public User registerUser(RegisterRequest request) {
        // Check if username already exists
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            // Use a more specific exception for business logic errors
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' already exists.");
        }

        // Find the role by ID, throw a more specific exception if not found
        Role role = roleRepo.findById(request.getRoleId())
            .orElseThrow(() -> new IllegalArgumentException("Role with ID " + request.getRoleId() + " not found."));

        User user = new User();
        user.setUsername(request.getUsername());
        // Use the autowired passwordEncoder bean to encode the password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));


        return userRepo.save(user);
    }
}
