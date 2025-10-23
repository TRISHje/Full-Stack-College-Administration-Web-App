package com.CAMS.app.Models.DAO.ServiceImpl;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.CAMS.app.Models.DAO.Services.DocumentService;
import com.CAMS.app.Models.Pojo.Document;
import com.CAMS.app.Models.Repositories.DocumentRepository;

@Service("documentService")
public class DocumentServiceImpl implements DocumentService{

    @Autowired
    private DocumentRepository documentRepository;
    
    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @Override
    public Optional<Document> getDocumentById(int documentId) {
        return documentRepository.findById(documentId);
    }

    @Override
    public Document addDocument(Document document) {
        return documentRepository.save(document);
    }

    @Override
    public Document updateDocument(int id, Document documentDetails) {
        // Find the existing document by its ID, or throw an exception if not found.
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        document.setDocumentType(documentDetails.getDocumentType());
        document.setClassName(documentDetails.getClassName());
        document.setPercentage(documentDetails.getPercentage());
        document.setFileName(documentDetails.getFileName());
        document.setFileContent(documentDetails.getFileContent());
        document.setRegistration(documentDetails.getRegistration());

        return documentRepository.save(document);
    }


    @Override
    public void deleteDocument(int id) {
        documentRepository.deleteById(id);
    }
    
    @Override
    public boolean isOwner(int id, String username) {
        Optional<Document> document = documentRepository.findById(id);
        return document.isPresent() && document.get().getRegistration().getUsername().equals(username);
    }

    @Override
    // This method now calls the corrected repository method
    public List<Document> getDocumentsByStudentId(int studentId) {
        return documentRepository.findByRegistration_StudentId(studentId);
    }
}
