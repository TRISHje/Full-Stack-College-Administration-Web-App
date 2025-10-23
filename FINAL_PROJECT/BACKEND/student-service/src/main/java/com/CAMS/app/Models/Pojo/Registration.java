package com.CAMS.app.Models.Pojo;

import java.time.*;

import jakarta.persistence.*;


@Entity
@Table(name="registrations") 
public class Registration {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="student_id")
	private int studentId;

	@Column(nullable=false)
	private String name;

	private Long phoneNo;
	private LocalDate dob;
	private String gender;
	private String address;
	private String city;
	private String state;

	@Column(nullable = false, length = 100, unique = true) // <--- MUST BE HERE
	private String email;

	@Column(unique = true, nullable = false) // <--- MUST BE HERE
	private String username;

	@Column(nullable = false) // Remove unique = true
	private String password;


	// Initialize directly or use @PrePersist for better control
	private LocalDateTime accountDate = LocalDateTime.now();

	private LocalDateTime registrationDate = LocalDateTime.now();
	private String status;
	private int marks10;
	private int marks12;


//	@ManyToOne
//    @JoinColumn(name = "course_id") // Corrected: removed incomplete 'cascade ='
//    private Course course;
	
	 @Column(name = "course_id")
	    private int courseId;



	// --- Constructors (Good Practice) ---
	public Registration() {
	}

	public Registration(int studentId, String name, String email, Long phoneNo, LocalDate dob, String gender, String address,
			String city, String state, String username, String password, String status, int marks10, int marks12, int courseId) {
		this.studentId = studentId;
		this.name = name;
		this.email = email;
		this.phoneNo = phoneNo;
		this.dob = dob;
		this.gender = gender;
		this.address = address;
		this.city = city;
		this.state = state;
		this.username = username;
		this.password = password;
		this.status = status;
		this.marks10 = marks10;
		this.marks12 = marks12;
		this.courseId = courseId;
	}

	public int getStudentId() {
		return studentId;
	}

	public void setStudentId(int studentId) {
		this.studentId = studentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(Long phoneNo) {
		this.phoneNo = phoneNo;
	}

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public LocalDateTime getAccountDate() {
		return accountDate;
	}

	public void setAccountDate(LocalDateTime accountDate) {
		this.accountDate = accountDate;
	}

	public LocalDateTime getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(LocalDateTime registrationDate) {
		this.registrationDate = registrationDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getMarks10() {
		return marks10;
	}

	public void setMarks10(int marks10) {
		this.marks10 = marks10;
	}

	public int getMarks12() {
		return marks12;
	}

	public void setMarks12(int marks12) {
		this.marks12 = marks12;
	}
//
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

	// --- Optional: toString() for easier debugging ---
//	@Override
//	public String toString() {
//		return "Registration{" +
//				"studentId=" + studentId +
//				", name='" + name + '\'' +
//				", email='" + email + '\'' +
//				", phoneNo=" + phoneNo +
//				", dob=" + dob +
//				", gender='" + gender + '\'' +
//				", address='" + address + '\'' +
//				", city='" + city + '\'' +
//				", state='" + state + '\'' +
//				", username='" + username + '\'' +
//				", password='" + "[PROTECTED]" + '\'' + // Avoid logging password
//				", accountDate=" + accountDate +
//				", registrationDate=" + registrationDate +
//				", status='" + status + '\'' +
//				", marks10=" + marks10 +
//				", marks12=" + marks12 +
//				", course=" + (course != null ? course.getCourseCode() : "null") + // Avoid deep recursion
//				'}';
//	}
}