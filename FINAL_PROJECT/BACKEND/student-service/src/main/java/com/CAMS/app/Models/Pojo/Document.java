package com.CAMS.app.Models.Pojo;

import jakarta.persistence.*;

@Entity
@Table(name="documents")
public class Document {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="document_id")
    private int documentId;
	
	private String documentType;
	
	private String className;
	
	private double percentage;
	
    private String fileName;
    
    @Lob
	@Column(name = "file_content", columnDefinition = "LONGBLOB")
    private byte[] fileContent;


    @ManyToOne
    @JoinColumn(name = "student_id")
    private Registration registration;


	public int getDocumentId() {
		return documentId;
	}


	public void setDocumentId(int documentId) {
		this.documentId = documentId;
	}


	public String getClassName() {
		return className;
	}


	public void setClassName(String className) {
		this.className = className;
	}


	public double getPercentage() {
		return percentage;
	}


	public void setPercentage(double percentage) {
		this.percentage = percentage;
	}


	public String getFileName() {
		return fileName;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}


	public byte[] getFileContent() {
		return fileContent;
	}


	public void setFileContent(byte[] fileContent) {
		this.fileContent = fileContent;
	}


	public Registration getRegistration() {
		return registration;
	}


	public void setRegistration(Registration registration) {
		this.registration = registration;
	}


	public Document(int documentId, String documentType, String className, double percentage, String fileName,
			byte[] fileContent, Registration registration) {
		super();
		this.documentId = documentId;
		this.documentType = documentType;
		this.className = className;
		this.percentage = percentage;
		this.fileName = fileName;
		this.fileContent = fileContent;
		this.registration = registration;
	}


	public String getDocumentType() {
		return documentType;
	}


	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}


	public Document() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
	
}
