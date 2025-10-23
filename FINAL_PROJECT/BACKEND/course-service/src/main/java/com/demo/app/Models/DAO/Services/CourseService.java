package com.demo.app.Models.DAO.Services;

import java.util.List;
import java.util.Optional;

import com.demo.app.Models.Pojo.Course;

public interface CourseService {
	List<Course> getAllCourses();
    Optional<Course> getCourseById(int courseId);
    Course addCourse(Course course);
    Course updateCourse(int courseId, Course courseDetails);
    void deleteCourse(int courseId);
	Optional<Course> getCourseByCourseCode(String courseCode);
	List<Object[]> getAllCoursesWithFees();
	Optional<Course> getCourseByName(String courseName);
	Optional<String> getCourseName(int courseId);

}
