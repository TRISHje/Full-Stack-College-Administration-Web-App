package com.CAMS.app.Models.DTO;

import java.time.LocalDate;



public class StudentDTO {

	    private String name;
	    private String email;
	    private Long phoneNo;
	    private LocalDate dob;
	    private String gender;
	    private String address;
	    private String city;
	    private String state;

	    private String courseName; 

	    private int marks10;
	    private int marks12;
	    
	    
	    
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
		public String getCourseName() {
			return courseName;
		}
		public void setCourseName(String courseType) {
			this.courseName = courseType;
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
	

}
