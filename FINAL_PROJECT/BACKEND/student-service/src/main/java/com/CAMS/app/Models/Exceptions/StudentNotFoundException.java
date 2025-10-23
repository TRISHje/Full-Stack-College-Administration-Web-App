package com.CAMS.app.Models.Exceptions;

public class StudentNotFoundException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public StudentNotFoundException(String message) {
        super(message);
    }
	
}
