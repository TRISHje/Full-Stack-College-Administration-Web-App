package com.CAMS.app.Models.DAO.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.CAMS.app.Models.DTO.AccountDTO;
import com.CAMS.app.Models.DTO.StudentDTO;

import com.CAMS.app.Models.Pojo.Registration;


@Component
public interface RegistrationService {
	Registration getProfile(String username);
	Registration createAccount(AccountDTO dto);
    Registration completeRegistration(String username, StudentDTO dto);
    AccountDTO getBasicInfo(String username);
    StudentDTO previewForm(String username);
    Registration updateProfile(String username,StudentDTO dto); 
    void uploadDocuments(String username, MultipartFile tenthMarksheet, MultipartFile twelfthMarksheet);
    String getApplicationStatus(String username);
	List<Registration> getAllStudents();
	Optional<String> getName(int studentId);
	Optional<Integer> getStudentIdByUsername(String username);
	byte[] getDocument(String username,String documentType);
	byte[] getDocumentById(int studentId,String documentType);
	
}