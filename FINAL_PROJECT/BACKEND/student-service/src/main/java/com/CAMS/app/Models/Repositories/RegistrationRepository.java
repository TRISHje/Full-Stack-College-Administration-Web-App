package com.CAMS.app.Models.Repositories;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.CAMS.app.Models.Pojo.Registration;

import feign.Param;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Integer> {
	
	boolean existsByUsername(String username);
	Optional<Registration> findByUsername(String username);
	boolean existsByEmail(String email);

	@Query("SELECT a.name FROM Registration a WHERE a.studentId = :studentId")
    Optional<String> getNameById(@Param("studentId") int studentId);
	
}
