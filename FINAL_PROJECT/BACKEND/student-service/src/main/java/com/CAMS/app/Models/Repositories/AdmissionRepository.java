package com.CAMS.app.Models.Repositories;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.CAMS.app.Models.Pojo.Admission;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Integer> {
	List<Admission> findByStatus(String status);
//	

	List<Admission> findByCourseId(int courseId);
	
	long countByStatus(String status);
	List<Admission> findByRegistration_StudentId(int studentId);
}
