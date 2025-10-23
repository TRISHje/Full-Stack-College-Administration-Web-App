package com.CAMS.app.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.CAMS.app.Models.DAO.Services.RegistrationService;
import com.CAMS.app.Models.DTO.AccountDTO;
import com.CAMS.app.Models.DTO.StudentDTO;
import com.CAMS.app.Models.Exceptions.StudentNotFoundException;
import com.CAMS.app.Models.Pojo.Registration;
import com.CAMS.app.Models.Repositories.RegistrationRepository;

@RestController

@RequestMapping("/student")
public class RegistrationController {

	 	@Autowired
	    private RegistrationService regService;
	 	
	 	@Autowired
	 	private RegistrationRepository regRepo;
	 
	 	@PostMapping("/create-account")
	    public ResponseEntity<Registration> createAccount(@RequestBody AccountDTO dto) {
	        return new ResponseEntity<>(regService.createAccount(dto), HttpStatus.CREATED);
	    }

	    @GetMapping("/basic-info/{username}")
	    public ResponseEntity<AccountDTO> getBasicInfo(@PathVariable String username) {
	        return new ResponseEntity<>(regService.getBasicInfo(username),HttpStatus.OK);
	    }

	    @PutMapping("/complete-registration/{username}")
	    public ResponseEntity<Registration> completeRegistration(@PathVariable String username,
	                                                                     @RequestBody StudentDTO dto) {
	        return new ResponseEntity<>(regService.completeRegistration(username, dto),HttpStatus.OK);
	    }
	    
	    @GetMapping("/preview/{username}")
	    public ResponseEntity<StudentDTO> previewForm(@PathVariable String username) throws StudentNotFoundException{
	    	StudentDTO dto = regService.previewForm(username);
	        return new ResponseEntity<>(dto,HttpStatus.OK);
	    }
	 
	    @PutMapping("/update/{username}")
	    public ResponseEntity<Registration> updateProfile(@PathVariable String username,@RequestBody StudentDTO dto) {
	        return new ResponseEntity<>(regService.updateProfile(username, dto),HttpStatus.OK);
	    }
	 
	    
	    @PostMapping("/upload-documents/{username}")
	    public ResponseEntity<String> uploadDocuments(@PathVariable String username,@RequestParam MultipartFile tenth,
	            @RequestParam MultipartFile twelfth) {
	        regService.uploadDocuments(username, tenth, twelfth);
	        return ResponseEntity.ok("Documents uploaded");
	    }

	    @GetMapping("/status/{username}")
	    public ResponseEntity<String> getStatus(@PathVariable String username) {
	        return new ResponseEntity<>(regService.getApplicationStatus(username),HttpStatus.OK);
	    }
	    
	    @GetMapping("/getAllStudents")
	    public List<Registration> getAllStudents() {
	    	return regService.getAllStudents();
	    }
	    
	    @GetMapping("/getName/{studentId}")
	    public ResponseEntity<String> getName(@PathVariable int studentId){
	    	Optional<String> name = regService.getName(studentId);

	        if (name.isPresent()) {
	            return new ResponseEntity<>(name.get(), HttpStatus.OK);
	        } else {

	            return new ResponseEntity<>("Course not found", HttpStatus.NOT_FOUND);
	        } 
	    }
	    
	    @GetMapping("/stats")
	    public long getStudentStats() {
	    	return regRepo.count();
	    }
	    
	    @GetMapping("/studentId/{username}")
	    public ResponseEntity<Integer> getStudentIdByUsername(@PathVariable String username) {
	        Optional<Integer> studentId = regService.getStudentIdByUsername(username);

	        // Check if the studentId is present and return appropriate ResponseEntity
	        return studentId.map(id -> new ResponseEntity<>(id, HttpStatus.OK))
	                        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	    }
	    
	    @GetMapping("/download/{username}/{documentType}")
	    public ResponseEntity<byte[]> downloadDocument(@PathVariable String username, @PathVariable String documentType) {
	        // Call a new method in your service to get the byte array
	        byte[] documentData = regService.getDocument(username, documentType);

	        if (documentData == null || documentData.length == 0) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // Set the headers to ensure the browser knows it's a PDF and to display it
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        
	        // "inline" opens the file in the browser, "attachment" prompts a download
	        headers.setContentDispositionFormData("inline", username + "_" + documentType + ".pdf");
	        headers.setContentLength(documentData.length);

	        return new ResponseEntity<>(documentData, headers, HttpStatus.OK);
	    }
	    @GetMapping("/downloadById/{studentId}/{documentType}")
	    public ResponseEntity<byte[]> downloadDocumentById(@PathVariable int studentId, @PathVariable String documentType) {
	        // Call a new method in your service to get the byte array
	        byte[] documentData = regService.getDocumentById(studentId, documentType);

	        if (documentData == null || documentData.length == 0) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // Set the headers to ensure the browser knows it's a PDF and to display it
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        
	        // "inline" opens the file in the browser, "attachment" prompts a download
	        headers.setContentDispositionFormData("inline", studentId + "_" + documentType + ".pdf");
	        headers.setContentLength(documentData.length);

	        return new ResponseEntity<>(documentData, headers, HttpStatus.OK);
	    }
	 
//	 @PostMapping("/register")
//	    public ResponseEntity<Registration> registerStudent(@RequestBody StudentDTO dto) {
//	        Registration added = regService.registerStudent(dto);
//	        return new ResponseEntity<>(added, HttpStatus.CREATED);
//	    }
	 
//	 @GetMapping("/profile/{id}")
//	    public ResponseEntity<Registration> getProfile(@PathVariable int id) {
//	        return new ResponseEntity<>(regService.getProfile(id),HttpStatus.OK);
//	    }
	 
	
	 
//	 @GetMapping("/status/{id}")
//	    public ResponseEntity<String> getStatus(@PathVariable int id) {
//	        return new ResponseEntity<>(regService.getStatus(id),HttpStatus.OK);
//	    }
	 
	 
	
	    
	    
	   
}
