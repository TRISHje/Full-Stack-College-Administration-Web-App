package com.CAMS.app.Models.DAO.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.CAMS.app.Config.CourseClient;
import com.CAMS.app.Models.DAO.Services.AdmissionService;
import com.CAMS.app.Models.DTO.CourseDTO;
import com.CAMS.app.Models.Pojo.Admission;
import com.CAMS.app.Models.Pojo.Registration;
import com.CAMS.app.Models.Exceptions.*;
import com.CAMS.app.Models.Repositories.AdmissionRepository;
import com.CAMS.app.Models.Repositories.RegistrationRepository;
//import com.CAMS.app.Models.Pojo.Course;
//import com.CAMS.app.Models.Repositories.CourseRepository;

@Service
public class AdmissionServiceImpl implements AdmissionService{

	@Autowired
	private AdmissionRepository admissionRepo;
	
	@Autowired
	private RegistrationRepository registrationRepo;
	
	
	@Autowired
	private CourseClient courseClient;
	
//	@Autowired
//	private CourseRepository courseRepo;
	
	@Override
	public List<Admission> getAllAdmissions() {
		return admissionRepo.findAll();
	}

	@Override
	public Optional<Admission> getAdmissionById(int admissionId) {
		return admissionRepo.findById(admissionId);
	}

	@Override
	public Admission addAdmission(Admission admission, int studentId) {
	    Registration registration = registrationRepo.findById(studentId)
	            .orElseThrow(() -> new InvalidInputException("Student with ID " + studentId + " not found in registration records. Admission cannot be added."));

//	    final String courseCode;
	    
	    final String courseCode = admission.getCourseCode();
	    
//	    if (admission.getCourse() != null) {
//	        courseCode = admission.getCourseCode();
//	    } else {
//	        courseCode = null;
//	    }

	    if (courseCode == null || courseCode.isEmpty()) {
	        throw new InvalidInputException("Course code must be provided for admission.");
	    }
	    
	    
//	    Course courseDTO = courseClient.getCourseByCourseCode(courseCode);
//        if (courseDTO == null) {
//            throw new InvalidInputException("Course with code '" + courseCode + "' not found. Admission cannot be added.");
//        }
	    
	    CourseDTO courseDTO = courseClient.getCourseByCourseCode(courseCode);
        if (courseDTO == null) {
            throw new InvalidInputException("Course with code '" + courseCode + "' not found. Admission cannot be added.");
        }


//	    Course course = courseRepo.findByCourseCode(courseCode)
//	            .orElseThrow(() -> new InvalidInputException("Course with code '" + courseCode + "' not found. Admission cannot be added."));

	    admission.setRegistration(registration);
//	    admission.setCourse(course);
	    admission.setCourseId(courseDTO.getCourseId());

	    if (admission.getApplicationDate() == null) {
	        admission.setApplicationDate(LocalDateTime.now());
	    }

	    return admissionRepo.save(admission);
	}

	@Override
	public Admission updateAdmission(int admissionId, Admission admissionDetails) {
		Admission admission = admissionRepo.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + admissionId)); // Custom exception handling is recommended

        admission.setRegistration(admissionDetails.getRegistration());
//        admission.setCourse(admissionDetails.getCourse());
        admission.setCourseId(admissionDetails.getCourseId());
        admission.setAdmissionType(admissionDetails.getAdmissionType());
        admission.setAcademicYear(admissionDetails.getAcademicYear());
        admission.setStatus(admissionDetails.getStatus());
        admission.setApplicationDate(admissionDetails.getApplicationDate());
        admission.setConcessionPercentage(admissionDetails.getConcessionPercentage());
        admission.setRemarks(admissionDetails.getRemarks());
        admission.setDecisionDate(admissionDetails.getDecisionDate());
        admission.setUsn(admissionDetails.getUsn());

        return admissionRepo.save(admission);
	}

	@Override
	public void deleteAdmission(int admissionId) {
		admissionRepo.deleteById(admissionId);
	}

	@Override
	public List<Admission> getAdmissionsByStatus(String status) {
		return admissionRepo.findByStatus(status);
	}

	@Override
	public List<Admission> getAdmissionByCourse(String courseCode) {
		// TODO Auto-generated method stub
//		return admissionRepo.findByCourse_CourseCode(course);
		
		CourseDTO courseDTO = courseClient.getCourseByCourseCode(courseCode);
        if (courseDTO == null) {
            throw new InvalidInputException("Course with code '" + courseCode + "' not found.");
        }
		return admissionRepo.findByCourseId(courseDTO.getCourseId());
	}
	
	@Override
    public boolean isOwner(int admissionId, String username) {
        Optional<Admission> admission = admissionRepo.findById(admissionId);
        return admission.isPresent() && admission.get().getRegistration().getUsername().equals(username);
	}
	
	@Override
    public List<Admission> getAdmissionsByStudentId(int studentId) {
        return admissionRepo.findByRegistration_StudentId(studentId);
    }
}
