package com.CAMS.app.Models.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.CAMS.app.Models.Pojo.*;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}