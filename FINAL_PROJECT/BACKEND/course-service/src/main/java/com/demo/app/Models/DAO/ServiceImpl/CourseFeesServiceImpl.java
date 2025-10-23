package com.demo.app.Models.DAO.ServiceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.app.Models.DAO.Services.CourseFeesService;
import com.demo.app.Models.Pojo.CourseFees;
import com.demo.app.Models.Pojo.CourseFeesRequest;
import com.demo.app.Models.Repositories.CourseFeesRepo;
import com.demo.app.Models.Repositories.CourseRepository;
import com.netflix.discovery.converters.Auto;

@Service
public class CourseFeesServiceImpl implements CourseFeesService {
	@Autowired
	private CourseFeesRepo courseFeesRepo;
	
	@Autowired
	private CourseRepository courseRepo;
	
	@Override
	public List<CourseFees> getAllCourseFees() {
		return courseFeesRepo.findAll();
	}

	@Override
	public Optional<CourseFees> getCourseFeesById(int courseFeesId) {
		return courseFeesRepo.findById(courseFeesId);
	}

	@Override
	public CourseFees addCourseFees(CourseFees courseFees) {
		return courseFeesRepo.save(courseFees);
	}

	@Override
	public CourseFees updateCourseFees(int CourseFeesId, CourseFees courseFeeDetails) {
		CourseFees courseFee = courseFeesRepo.findById(CourseFeesId) 
				.orElseThrow(() -> new RuntimeException("Course Fee not found with id: " + CourseFeesId));
		courseFee.setCourse(courseFeeDetails.getCourse()); // Update the associated Course object
		courseFee.setBaseFee(courseFeeDetails.getBaseFee());
		courseFee.setTaxRate(courseFeeDetails.getTaxRate());
		return courseFeesRepo.save(courseFee);
	}

	@Override
	public void deleteCourseFees(int courseFeesId) {
		courseFeesRepo.deleteById(courseFeesId);
	}
	
	@Override
	public Optional<CourseFees> getCourseFeeByCourseCode(String courseCode) {
		return courseFeesRepo.findByCourse_CourseCode(courseCode);
	}

	@Override
	public CourseFees addCourseFeesWithCourseCode(CourseFeesRequest request) {
	    // Step 1: Find the Course entity by its courseCode
	    return courseRepo.findByCourseCode(request.getCourseCode())
	            .map(course -> {
	                // Step 2: Create a new CourseFees entity
	                CourseFees courseFees = new CourseFees();
	                courseFees.setCourse(course); // Link the CourseFees to the Course
	                courseFees.setBaseFee(request.getBaseFee());
	                courseFees.setTaxRate(request.getTaxRate());
	                
	                // Step 3: Save the new CourseFees entity
	                return courseFeesRepo.save(courseFees); // This line was the source of the error
	            })
	            .orElseThrow(() -> new RuntimeException("Course not found with code " + request.getCourseCode()));
	}

	@Override
	public CourseFees updateCourseFeesByCourseCode(String courseCode, CourseFees updatedCourseFees) {
        Optional<CourseFees> existingFeesOptional = courseFeesRepo.findByCourse_CourseCode(courseCode);

        if (existingFeesOptional.isPresent()) {
            CourseFees existingFees = existingFeesOptional.get();
            existingFees.setBaseFee(updatedCourseFees.getBaseFee());
            existingFees.setTaxRate(updatedCourseFees.getTaxRate());
            
            // Note: The course ID should not be changed as it's the primary key.
            return courseFeesRepo.save(existingFees);
        } else {
            throw new RuntimeException("Course fees not found for code: " + courseCode);
        }
    }

	@Override
	public void deleteCourseFeesByCourseCode(String courseCode) {
        Optional<CourseFees> existingFeesOptional = courseFeesRepo.findByCourse_CourseCode(courseCode);

        if (existingFeesOptional.isPresent()) {
            CourseFees existingFees = existingFeesOptional.get();
            // Delete the entity if it is found
            courseFeesRepo.delete(existingFees);
        } else {
            // Throw an exception if the course is not found,
            // which will be caught by the controller
            throw new RuntimeException("Course fees not found for code: " + courseCode);
        }
    }
}