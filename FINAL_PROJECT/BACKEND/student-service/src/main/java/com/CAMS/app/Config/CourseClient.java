package com.CAMS.app.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import com.CAMS.app.Models.DTO.CourseDTO;



//url="http://localhost:8081"

@FeignClient(name="course-service")
public interface CourseClient {
	
	@GetMapping("/courses/getCourseByCode/{courseCode}")
    public CourseDTO getCourseByCourseCode(@PathVariable String courseCode );
	
	 @GetMapping("/courses/getCourseById/{courseId}")
	    CourseDTO getCourseById(@PathVariable int courseId);
	 
	 @GetMapping("/courses/getCourseByName/{courseName}")
	    CourseDTO getCourseByCourseName(@PathVariable String courseName);

}
