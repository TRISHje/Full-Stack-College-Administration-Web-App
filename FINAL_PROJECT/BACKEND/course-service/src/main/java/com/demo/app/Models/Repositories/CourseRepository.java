package com.demo.app.Models.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.demo.app.Models.Pojo.*;

import feign.Param;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

	Optional<Course> findByCourseCode(String courseCode);

	
	@Query(value = "SELECT c.course_code AS Course, c.course_name AS Name, (f.base_fee + (f.base_fee * f.tax_rate / 100)) AS total_fees "
			+ "FROM courses c "
			+ "JOIN course_fees f "
			+ "ON c.course_id = f.course_id",
			nativeQuery = true)
	List<Object[]> findAllCourseFeeDetailsAsObjects();
	
	Optional<Course> findByCourseNameIgnoreCase(String courseName);
	
	@Query("SELECT c.courseName FROM Course c WHERE c.courseId = :courseId")
    Optional<String> getCourseNameById(@Param("courseId") int courseId);
}
