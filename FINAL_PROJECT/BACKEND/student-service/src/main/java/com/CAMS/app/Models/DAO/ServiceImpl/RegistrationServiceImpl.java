package com.CAMS.app.Models.DAO.ServiceImpl;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.CAMS.app.Config.CourseClient;
import com.CAMS.app.Models.DAO.Services.RegistrationService;
import com.CAMS.app.Models.DTO.AccountDTO;
import com.CAMS.app.Models.DTO.CourseDTO;
import com.CAMS.app.Models.DTO.StudentDTO;
import com.CAMS.app.Models.Exceptions.CourseNotFoundException;
import com.CAMS.app.Models.Exceptions.StudentNotFoundException;
import com.CAMS.app.Models.Pojo.Document;
import com.CAMS.app.Models.Pojo.Registration;
import com.CAMS.app.Models.Pojo.User;
import com.CAMS.app.Models.Pojo.Role;
import com.CAMS.app.Models.Repositories.DocumentRepository;
import com.CAMS.app.Models.Repositories.RegistrationRepository;
//import com.CAMS.app.Models.Pojo.Course;
//import com.CAMS.app.Models.Repositories.CourseRepository;
import com.CAMS.app.Models.Repositories.UserRepository;
import com.CAMS.app.Models.Repositories.RoleRepository;


@Service
public class RegistrationServiceImpl implements RegistrationService {

	@Autowired
	private RegistrationRepository regisRepo;
	
//	@Autowired
//	private CourseRepository courseRepo;
	
	@Autowired
    private CourseClient courseClient;
	
	@Autowired
	private DocumentRepository docRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;
	
	
	public Registration createAccount(AccountDTO dto) {
		if (regisRepo.existsByEmail(dto.getEmail())) {
			throw new IllegalArgumentException("Email already registered"); // More specific exception
		}
		
		String username = generateUsername(dto.getName());
		String rawPassword = dto.getPassword();

		// 1. Create and save the User (Authentication Credentials) first
		// This is done first to get the userId for linking
		Role studentRole = roleRepo.findByRoleName("STUDENT")
		                           .orElseThrow(() -> new IllegalArgumentException("Role 'STUDENT' not found. Please create it in the roles table."));

		User newUser = new User();
		newUser.setUsername(username);
		newUser.setPassword(passwordEncoder.encode(rawPassword));
		newUser.setRole(studentRole);
		newUser.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
		
		User savedUser = userRepo.save(newUser); // Save user to get its generated ID

		// 2. Create and save the Registration (Student Profile)
		Registration student = new Registration();
		student.setName(dto.getName());
		student.setEmail(dto.getEmail());
		student.setUsername(username);
		student.setPassword(passwordEncoder.encode(rawPassword)); // Password also stored in Registration table
		student.setAccountDate(LocalDateTime.now());
		student.setStatus("Account Created");
		
		// IMPORTANT: Set the userId from the newly created User onto the Registration
		// Assuming your Registration Pojo has a setUserId method and a userId field
		// student.setUserId(savedUser.getUserId()); // Uncomment if Registration Pojo has a userId field

		Registration savedRegistration = regisRepo.save(student);
		
		return savedRegistration;
	}
	
	private String generateUsername(String name) {
		String base = name.trim().toLowerCase().replaceAll("\\s+", "");
		base = base.length() > 4 ? base.substring(0, 4) : base;

		String uuidPart;
		String username;

		do {
			uuidPart = UUID.randomUUID().toString().substring(0, 4);
			username = base + uuidPart;
		} while (regisRepo.existsByUsername(username) || userRepo.findByUsername(username).isPresent()); // Check uniqueness in both tables

		return username;
	}
	
	public AccountDTO getBasicInfo(String username) {
		Registration student = regisRepo.findByUsername(username)
				.orElseThrow(() -> new StudentNotFoundException("Student not found")); // More specific exception

		AccountDTO dto = new AccountDTO();
		dto.setName(student.getName());
		dto.setEmail(student.getEmail());
		return dto;
	}
	
	public Registration completeRegistration(String username, StudentDTO dto) {
		Registration student = regisRepo.findByUsername(username)
				.orElseThrow(() -> new StudentNotFoundException("Student not found")); // More specific exception

//		Course course = courseRepo.findByCourseNameIgnoreCase(dto.getCourseName())
//				.orElseThrow(() -> new CourseNotFoundException("Invalid course"));
		
		
		CourseDTO courseDTO = courseClient.getCourseByCourseName(dto.getCourseName());
	
		if (courseDTO == null) {
			throw new CourseNotFoundException("Invalid course");
		}

		student.setPhoneNo(dto.getPhoneNo());
		student.setDob(dto.getDob());
		student.setGender(dto.getGender());
		student.setAddress(dto.getAddress());
		student.setCity(dto.getCity());
		student.setState(dto.getState());
		student.setMarks10(dto.getMarks10());
		student.setMarks12(dto.getMarks12());
//		student.setCourse(course);
		student.setCourseId(courseDTO.getCourseId());
		student.setRegistrationDate(LocalDateTime.now());
		student.setStatus("Approval Pending");

		return regisRepo.save(student);
	}
	
	public StudentDTO previewForm(String username) {
		Registration s = regisRepo.findByUsername(username)
				.orElseThrow(() -> new StudentNotFoundException("Student not found with username: " + username));

		StudentDTO dto = new StudentDTO();
		dto.setName(s.getName());
		dto.setEmail(s.getEmail());
		dto.setPhoneNo(s.getPhoneNo());
		dto.setDob(s.getDob());
		dto.setGender(s.getGender());
		dto.setAddress(s.getAddress());
		dto.setCity(s.getCity());
		dto.setState(s.getState());
		dto.setMarks10(s.getMarks10());
		dto.setMarks12(s.getMarks12());
//		dto.setCourseName(s.getCourse().getCourseName());
		
		CourseDTO course = courseClient.getCourseById(s.getCourseId());
        if (course != null) {
            dto.setCourseName(course.getCourseName());
        } else {
            dto.setCourseName("Unknown Course"); // Provide a default if the course is not found
        }

		return dto;
	}


	@Override
	public Registration getProfile(String username) {
		return regisRepo.findByUsername(username)
				.orElseThrow(() -> new StudentNotFoundException("Student not found")); // More specific exception
	}

	@Override
	public Registration updateProfile(String username, StudentDTO dto) {
		Registration student = getProfile(username);

		student.setPhoneNo(dto.getPhoneNo());
		student.setDob(dto.getDob());
		student.setGender(dto.getGender());
		student.setAddress(dto.getAddress());
		student.setCity(dto.getCity());
		student.setState(dto.getState());
		student.setMarks10(dto.getMarks10());
		student.setMarks12(dto.getMarks12());
		return regisRepo.save(student);
	}


	
	@Override
	public void uploadDocuments(String username, MultipartFile tenth, MultipartFile twelfth) {
		Registration student = regisRepo.findByUsername(username)
				.orElseThrow(() -> new StudentNotFoundException("Student not found")); // More specific exception
		try {
			Document d1 = new Document();
			// d1.setDocumentId(0); // Remove this line; JPA handles auto-increment
			d1.setDocumentType("10th");
			d1.setFileName(tenth.getOriginalFilename());
			d1.setRegistration(student);
			d1.setFileContent(tenth.getBytes());

			Document d2 = new Document();
			// d2.setDocumentId(0); // Remove this line; JPA handles auto-increment
			d2.setDocumentType("12th");
			d2.setFileName(twelfth.getOriginalFilename());
			d2.setRegistration(student);
			d2.setFileContent(twelfth.getBytes());

			docRepo.saveAll(List.of(d1, d2));

		} catch (IOException e) {
			throw new RuntimeException("Failed to upload documents", e);
			}
		}	
	@Override
	public String getApplicationStatus(String username) {
			Registration student = regisRepo.findByUsername(username)
					.orElseThrow(() -> new StudentNotFoundException("Student not found")); // More specific exception
			return student.getStatus();
		}

	@Override
	public List<Registration> getAllStudents() {
		// TODO Auto-generated method stub
		return regisRepo.findAll();
	}

	@Override
	public Optional<String> getName(int studentId) {

		return regisRepo.getNameById(studentId);
	}
	
	@Override
	public Optional<Integer> getStudentIdByUsername(String username) {
        // Find the registration by username
        Optional<Registration> registrationOptional = regisRepo.findByUsername(username);

        // If a registration is found, return its studentId, otherwise return an empty Optional
        return registrationOptional.map(Registration::getStudentId);
    }
	
	@Override
	public byte[] getDocument(String username, String documentType) {
	    // Step 1: Find the student's Registration object using their username.
	    Optional<Registration> registration = regisRepo.findByUsername(username);

	    if (registration.isPresent()) {
	        int studentId = registration.get().getStudentId();
	        
	        // Step 2: Use the student ID to find the specific document.
	        Optional<Document> document = docRepo.findByRegistrationStudentIdAndDocumentType(studentId, documentType);

	        if (document.isPresent()) {
	            return document.get().getFileContent();
	        }
	    }
	    return null;
	}
	@Override
	public byte[] getDocumentById(int studentId, String documentType) {
	    // Step 1: Find the student's Registration object using their username.
	    Optional<Registration> registration = regisRepo.findById(studentId);

	    if (registration.isPresent()) {

	        // Step 2: Use the student ID to find the specific document.
	        Optional<Document> document = docRepo.findByRegistrationStudentIdAndDocumentType(studentId, documentType);

	        if (document.isPresent()) {
	            return document.get().getFileContent();
	        }
	    }
	    return null;
	}
}
