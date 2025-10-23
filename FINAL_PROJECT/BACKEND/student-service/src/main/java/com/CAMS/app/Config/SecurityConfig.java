package com.CAMS.app.Config;

import com.CAMS.app.Models.DAO.Services.CustomUserDetailsService; // Ensure this import is correct
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder; // Import this
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService; // Keep this import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // These components are required for the JWT authentication flow
    @Autowired
    private CustomUserDetailsService customUserDetailsService; // This is your database-backed service

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // This bean tells Spring Security to use your CustomUserDetailsService for authentication
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // This will automatically use the CustomUserDetailsService that is @Autowired
        // or any UserDetailsService bean available in the context.
        return authenticationConfiguration.getAuthenticationManager();
    }

    // IMPORTANT: Removed the inMemoryUserDetailsService bean.
    // It's no longer needed as you have a CustomUserDetailsService.
    /*
    @Bean
    public UserDetailsService inMemoryUserDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails adminUser = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(adminUser);
    }
    */

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF since we are using a token-based authentication (stateless)
            .csrf(csrf -> csrf.disable())

            // Configure request authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow public access to the auth endpoints and H2 console
                .requestMatchers("/users/login**", "/h2-console/**", "/users/register", "/student/**").permitAll() // Ensure /users/register is also permitted if it's public
                // Require ADMIN role for all requests to /admin/**
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )

            // Configure exception handling for unauthorized access
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))

            // Configure session management to be stateless, which is essential for JWT
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Add our custom JWT filter before the default Spring Security filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // This is needed to make the H2 console work within a frame
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
}
