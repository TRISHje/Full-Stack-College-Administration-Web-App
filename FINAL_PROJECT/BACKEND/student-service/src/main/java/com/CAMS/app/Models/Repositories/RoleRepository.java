package com.CAMS.app.Models.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.CAMS.app.Models.Pojo.*;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);
}