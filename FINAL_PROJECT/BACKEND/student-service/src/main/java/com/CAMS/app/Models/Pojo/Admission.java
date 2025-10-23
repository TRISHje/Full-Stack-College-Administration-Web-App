package com.CAMS.app.Models.Pojo;

import java.time.LocalDateTime;


import jakarta.persistence.*;


@Entity
@Table(name = "admissions")
public class Admission {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admission_id")
	private int admissionId;
	
	@ManyToOne
	@JoinColumn(name = "student_id", referencedColumnName = "student_id")
	private Registration registration;
	
//	@ManyToOne
//	@JoinColumn(name = "course_id", referencedColumnName = "course_id", insertable = false, updatable = false)
//	private Course course;
	
	@Column(name = "course_id")
	private int courseId;
	
	@Transient 
    private String courseCode;
	
	
	@Column(name = "admission_type", nullable = false)
	private String admissionType;
	
	@Column(name = "academic_year", nullable = false)
	private int academicYear;
	
	@Column(name = "status", nullable = false)
	private String status;
	
	@Column(name = "application_date", nullable = false)
	private LocalDateTime applicationDate;
	
	@Column(name = "concession_percentage")
	private double concessionPercentage;
	
	@Column(name = "remarks")
	private String remarks;
	
	@Column(name = "decision_date")
	private LocalDateTime decisionDate;
	
	private String usn;
	
	
	
	public Admission(int admissionId, Registration registration, int courseId, String admissionType, int academicYear,
			String status, LocalDateTime applicationDate, double concessionPercentage, String remarks,
			LocalDateTime decisionDate, String usn) {
		super();
		this.admissionId = admissionId;
		this.registration = registration;
//		this.course = course;
		this.courseId = courseId; 
		this.admissionType = admissionType;
		this.academicYear = academicYear;
		this.status = status;
		this.applicationDate = applicationDate;
		this.concessionPercentage = concessionPercentage;
		this.remarks = remarks;
		this.decisionDate = decisionDate;
		this.usn = usn;
	}
	
	public Admission() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	 public String getCourseCode() {
	        return courseCode;
	    }

	    public void setCourseCode(String courseCode) {
	        this.courseCode = courseCode;
	    }

	public String getUsn() {
		return usn;
	}

	public void setUsn(String usn) {
		this.usn = usn;
	}

	

	public int getAdmissionId() {
		return admissionId;
	}

	public void setAdmissionId(int admissionId) {
		this.admissionId = admissionId;
	}

	public Registration getRegistration() {
		return registration;
	}

	public void setRegistration(Registration registration) {
		this.registration = registration;
	}

//	public Course getCourse() {
//		return course;
//	}
//
//	public void setCourse(Course course) {
//		this.course = course;
//	}


	
	public int getCourseId()
	{ return courseId; 
	}
	
	public void setCourseId(int courseId)
	{ this.courseId = courseId; 
	}
	
	public String getAdmissionType() {
		return admissionType;
	}

	public void setAdmissionType(String admissionType) {
		this.admissionType = admissionType;
	}

	public int getAcademicYear() {
		return academicYear;
	}

	public void setAcademicYear(int academicYear) {
		this.academicYear = academicYear;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(LocalDateTime applicationDate) {
		this.applicationDate = applicationDate;
	}

	public double getConcessionPercentage() {
		return concessionPercentage;
	}

	public void setConcessionPercentage(double concessionPercentage) {
		this.concessionPercentage = concessionPercentage;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public LocalDateTime getDecisionDate() {
		return decisionDate;
	}

	public void setDecisionDate(LocalDateTime decisionDate) {
		this.decisionDate = decisionDate;
	}

	
}
