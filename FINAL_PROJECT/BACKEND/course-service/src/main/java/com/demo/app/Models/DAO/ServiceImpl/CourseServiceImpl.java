package com.demo.app.Models.DAO.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.app.Models.DAO.Services.CourseService;
import com.demo.app.Models.Pojo.Course;
import com.demo.app.Models.Repositories.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

	@Autowired
	private CourseRepository courseRepo;
	
	@Override
	public List<Course> getAllCourses() {
		return courseRepo.findAll();
	}

	@Override
	public Optional<Course> getCourseById(int courseId) {
		return courseRepo.findById(courseId);
	}

	@Override
	public Course addCourse(Course course) {
		course.setCreatedAt(LocalDateTime.now());
		return courseRepo.save(course);
	}

	@Override
	public Course updateCourse(int courseId, Course courseDetails) {
		Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        course.setCourseCode(courseDetails.getCourseCode());
        course.setCourseName(courseDetails.getCourseName());
        course.setDescription(courseDetails.getDescription());
        course.setDuration(courseDetails.getDuration());
        course.setTotalSeats(courseDetails.getTotalSeats());
        course.setIsActive(courseDetails.getIsActive());
        course.setCreatedAt(courseDetails.getCreatedAt());
        course.setCreatedAt(LocalDateTime.now());

        return courseRepo.save(course);
	}

	@Override
	public void deleteCourse(int courseId) {
		if (!courseRepo.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        courseRepo.deleteById(courseId);
	}

	@Override
	public Optional<Course> getCourseByCourseCode(String courseCode) {
		return courseRepo.findByCourseCode(courseCode);
	}

	@Override
	public List<Object[]> getAllCoursesWithFees() {
		return courseRepo.findAllCourseFeeDetailsAsObjects();
	}
	
	@Override
    public Optional<Course> getCourseByName(String courseName) {
        return courseRepo.findByCourseNameIgnoreCase(courseName);
    }

	@Override
	public Optional<String> getCourseName(int courseId) {
		return courseRepo.getCourseNameById(courseId);
	}

}
