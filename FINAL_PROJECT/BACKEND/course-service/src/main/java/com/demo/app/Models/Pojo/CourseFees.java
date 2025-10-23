package com.demo.app.Models.Pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "course_fees")
public class CourseFees {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_fee_id")
	private int courseFeeId;
	
	@ManyToOne // Consider LAZY fetching for performance
    @JoinColumn(name = "course_id", referencedColumnName = "course_id", nullable = false)
	private Course course;
	
	@Column(name = "base_fee", nullable = false)
	private double baseFee;
	
	@Column(name = "tax_rate", nullable = false)
	private double taxRate;

	public int getCourseFeeId() {
		return courseFeeId;
	}

	public void setCourseFeeId(int courseFeeId) {
		this.courseFeeId = courseFeeId;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}

	public double getBaseFee() {
		return baseFee;
	}

	public void setBaseFee(double baseFee) {
		this.baseFee = baseFee;
	}

	public double getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(double taxRate) {
		this.taxRate = taxRate;
	}
	
	
}
