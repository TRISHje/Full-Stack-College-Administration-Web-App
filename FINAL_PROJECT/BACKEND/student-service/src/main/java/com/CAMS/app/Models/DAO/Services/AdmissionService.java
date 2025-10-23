package com.CAMS.app.Models.DAO.Services;

import java.util.List;
import java.util.Optional;

import com.CAMS.app.Models.Pojo.Admission;

public interface AdmissionService {

	List<Admission> getAllAdmissions();

	Optional<Admission> getAdmissionById(int admissionId);

	Admission addAdmission(Admission admission, int studentId);

	Admission updateAdmission(int admissionId, Admission admissionDetails);

	void deleteAdmission(int admissionId);

	List<Admission> getAdmissionsByStatus(String status);

	List<Admission> getAdmissionByCourse(String course);

	boolean isOwner(int admissionId, String username);
	List<Admission> getAdmissionsByStudentId(int studentId);
}
