package com.demo.app.Models.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.app.Models.Pojo.CourseFees;

@Repository
public interface CourseFeesRepo extends JpaRepository<CourseFees, Integer> {
	Optional<CourseFees> findByCourse_CourseCode(String courseCode);

}
