package com.CAMS.app.Models.Repositories;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.CAMS.app.Models.Pojo.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    // Corrected method name to search within the nested Registration object
    List<Document> findByRegistration_StudentId(int studentId);
    Optional<Document> findByRegistrationStudentIdAndDocumentType(int studentId, String documentType);
}
