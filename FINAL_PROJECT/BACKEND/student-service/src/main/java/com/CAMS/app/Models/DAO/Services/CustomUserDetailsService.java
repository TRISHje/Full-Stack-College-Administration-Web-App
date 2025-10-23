package com.CAMS.app.Models.DAO.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.CAMS.app.Models.Repositories.*;
import com.CAMS.app.Models.Pojo.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired 
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // CORRECTED LINE: Add "ROLE_" prefix to the role name
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName()))
        );
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
