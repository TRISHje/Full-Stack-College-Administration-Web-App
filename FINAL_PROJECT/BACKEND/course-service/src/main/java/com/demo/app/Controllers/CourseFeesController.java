package com.demo.app.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.demo.app.Models.DAO.Services.CourseFeesService;
import com.demo.app.Models.Pojo.CourseFees;
import com.demo.app.Models.Pojo.CourseFeesRequest;

@RestController
@RequestMapping("/courseFees")
public class CourseFeesController{

	@Autowired
	private CourseFeesService courseFeesService;

	@GetMapping("/getAllCourseFees")
    public List<CourseFees> getAllCourseFees() {
        return courseFeesService.getAllCourseFees();
    }

    @GetMapping("/getCourseFeesById/{courseFeesId}")
    public ResponseEntity<CourseFees> getCourseFeesById(@PathVariable int courseFeesId) {
        Optional<CourseFees> courseFee = courseFeesService.getCourseFeesById(courseFeesId);
        return courseFee.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/getCourseFeesByCourseCode/{courseCode}")
    public ResponseEntity<CourseFees> getCourseFeesByCourseCode(@PathVariable String courseCode) {
        Optional<CourseFees> courseFee = courseFeesService.getCourseFeeByCourseCode(courseCode);
        return courseFee.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/addCourseFees")
    public ResponseEntity<CourseFees> createCourseFees(@RequestBody CourseFeesRequest courseFeesRequest) {
        try {
            CourseFees createdCourseFee = courseFeesService.addCourseFeesWithCourseCode(courseFeesRequest);
            return new ResponseEntity<>(createdCourseFee, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Handle the case where the course code is not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updateCourseFees/{courseFeesId}")
    public ResponseEntity<CourseFees> updateCourseFees(@PathVariable int courseFeesId, @RequestBody CourseFees courseFeeDetails) {
        try {
            CourseFees updatedCourseFee = courseFeesService.updateCourseFees(courseFeesId, courseFeeDetails);
            return ResponseEntity.ok(updatedCourseFee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handled by GlobalExceptionHandler
        }
    }
    
    @PutMapping("/updateCourseFeesByCourseCode/{courseCode}")
    public ResponseEntity<CourseFees> updateCourseFeesByCourseCode(
            @PathVariable String courseCode, 
            @RequestBody CourseFees updatedCourseFees) {
        try {
            CourseFees result = courseFeesService.updateCourseFeesByCourseCode(courseCode, updatedCourseFees);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("deleteCourseFees/{courseFeesId}")
    public ResponseEntity<Void> deleteCourseFee(@PathVariable int courseFeesId) {
        try {
            courseFeesService.deleteCourseFees(courseFeesId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handled by GlobalExceptionHandler
        }
    }
    
    @DeleteMapping("/deleteCourseFeesByCourseCode/{courseCode}")
    public ResponseEntity<Void> deleteCourseFeesByCourseCode(@PathVariable String courseCode) {
        try {
            courseFeesService.deleteCourseFeesByCourseCode(courseCode);
            // Return 204 No Content for a successful deletion
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Return 404 Not Found if the course code does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
