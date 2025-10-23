package com.CAMS.app.Models.Exceptions;

public class InvalidStudentException extends RuntimeException {

    public InvalidStudentException(String message){
        super(message);
    }

}
