package com.demo.app.Models.DAO.Services;

import java.util.List;
import java.util.Optional;

import com.demo.app.Models.Pojo.CourseFees;
import com.demo.app.Models.Pojo.CourseFeesRequest;

public interface CourseFeesService {
	List<CourseFees> getAllCourseFees();
    Optional<CourseFees> getCourseFeesById(int courseFeesId);
    CourseFees addCourseFees(CourseFees courseFees);
    CourseFees updateCourseFees(int CourseFeesId, CourseFees courseFeeDetails);
    void deleteCourseFees(int courseFeesId);
 
    Optional<CourseFees> getCourseFeeByCourseCode(String courseCode);
	CourseFees addCourseFeesWithCourseCode(CourseFeesRequest courseFeesRequest);
	CourseFees updateCourseFeesByCourseCode(String courseCode, CourseFees updatedCourseFees);
	void deleteCourseFeesByCourseCode(String courseCode);
}
