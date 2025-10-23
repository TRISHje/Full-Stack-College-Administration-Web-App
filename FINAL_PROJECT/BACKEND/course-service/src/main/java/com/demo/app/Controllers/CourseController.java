package com.demo.app.Controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.demo.app.Models.DAO.Services.*;
import com.demo.app.Models.Pojo.Course;
import com.demo.app.Models.Repositories.CourseRepository;
import com.netflix.discovery.converters.Auto;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private CourseRepository courseRepo;

    @GetMapping("/getAllCourses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    
    @GetMapping("/getAllCoursesWithFees")
    public List<Object[]> getAllCoursesWithFees() {
        return courseService.getAllCoursesWithFees();
    }

    @GetMapping("/getCourseById/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable int courseId) {
        Optional<Course> course = courseService.getCourseById(courseId);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/getCourseByCode/{courseCode}")
    public ResponseEntity<Course> getCourseByCourseCode(@PathVariable String courseCode) {
        Optional<Course> course = courseService.getCourseByCourseCode(courseCode);
        return course.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/addCourse")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.addCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @PutMapping("/updateCourse/{courseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable int courseId, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handled by GlobalExceptionHandler
        }
    }

    @DeleteMapping("/deleteCourse/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable int courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handled by GlobalExceptionHandler
        }
    }
    
    
    @GetMapping("/getCourseByName/{courseName}")
    public ResponseEntity<Course> getCourseByName(@PathVariable String courseName) {
        Optional<Course> course = courseService.getCourseByName(courseName);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/getCourseName/{courseId}")
    public ResponseEntity<String> getCourseName(@PathVariable int courseId) {
        Optional<String> courseName = courseService.getCourseName(courseId);

        if (courseName.isPresent()) {
            return new ResponseEntity<>(courseName.get(), HttpStatus.OK);
        } else {

            return new ResponseEntity<>("Course not found", HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/stats")
    public long getCoursesStats() {
    	return courseRepo.count();
    }
}
