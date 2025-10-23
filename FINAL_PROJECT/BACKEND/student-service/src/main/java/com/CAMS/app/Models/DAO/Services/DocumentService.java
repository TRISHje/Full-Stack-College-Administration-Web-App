package com.CAMS.app.Models.DAO.Services;

import java.util.List;
import java.util.Optional;
import com.CAMS.app.Models.Pojo.Document;

public interface DocumentService {
    List<Document> getAllDocuments();
    Optional<Document> getDocumentById(int documentId);
    Document addDocument(Document document);
    Document updateDocument(int id, Document documentDetails);
    void deleteDocument(int id);
    boolean isOwner(int id, String username);
    
    // Corrected method signature to match the repository
    List<Document> getDocumentsByStudentId(int studentId);
}
