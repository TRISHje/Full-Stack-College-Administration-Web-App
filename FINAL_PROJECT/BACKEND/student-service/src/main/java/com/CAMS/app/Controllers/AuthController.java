package com.CAMS.app.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.CAMS.app.Models.DTO.*;
import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Config.*;
import com.CAMS.app.Models.DAO.Services.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class AuthController {
    
    @Autowired 
    private AuthenticationManager authManager;
    
    @Autowired 
    private CustomUserDetailsService userDetailsService;
    
    @Autowired 
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired 
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = authService.registerUser(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Authenticate the user once and get the authentication object
        Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        // Set the authentication object in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get the UserDetails directly from the authentication object (no second DB call)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate the JWT token
        String token = jwtTokenUtil.generateToken(userDetails);
        
        // Get roles and format them into a clean comma-separated string
        String roles = userDetails.getAuthorities().stream()
                               .map(auth -> auth.getAuthority())
                               .collect(Collectors.joining(","));

        // Return a structured response with the token and roles
        return ResponseEntity.ok(new LoginResponse(token, roles));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        // Fetch all users using the service
        List<User> users = userDetailsService.getAllUsers();
        
        // Map the User entities to DTOs to avoid exposing sensitive data like passwords
        List<UserDTO> userDtos = users.stream()
            .map(user -> new UserDTO(
                user.getUsername(), 
                user.getRole().getRoleName())) // Assuming a simple UserDto
            .collect(Collectors.toList());

        // Return the list of DTOs
        return new ResponseEntity<>(userDtos, HttpStatus.OK);
    }
}
