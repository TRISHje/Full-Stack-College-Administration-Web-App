package com.CAMS.app.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import com.CAMS.app.Models.DAO.Services.DocumentService;
import com.CAMS.app.Models.Pojo.Document;

@RestController
@RequestMapping("/documents")
public class DocumentController {
	
	@Autowired
	private DocumentService documentService;
	
	@GetMapping("/getAllDocuments")
	public List<Document> getAllDocuments() {
		return documentService.getAllDocuments();
	}
	
	@PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#documentId, authentication.name)")
	@GetMapping("/getDocument/{documentId}")
	public ResponseEntity<Document> getDocumentById(@PathVariable int documentId) {
		Optional<Document> document = documentService.getDocumentById(documentId);
		return document.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	@PreAuthorize("hasRole('STUDENT')")
	@PostMapping("/addDocument")
	public ResponseEntity<Document> addDocument(@RequestBody Document document) {
		Document createdDocument = documentService.addDocument(document);
		return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#documentId, authentication.name)")
	@PutMapping("/updateDocument/{documentId}")
	public ResponseEntity<Document> updateDocument(@PathVariable int documentId, @RequestBody Document documentDetails) {
		try {
			Document updatedDoc = documentService.updateDocument(documentId, documentDetails);
			return ResponseEntity.ok(updatedDoc);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PreAuthorize("hasRole('ADMIN') or @documentService.isOwner(#id, authentication.name)")
	@DeleteMapping("/deleteDocument/{id}")
	public ResponseEntity<Void> deleteDocument(@PathVariable int id) {
		documentService.deleteDocument(id);
		return ResponseEntity.noContent().build();
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getDocumentsByStudentId/{studentId}")
	public List<Document> getAllDocumentsByStudentId(@PathVariable int studentId) {
		return documentService.getDocumentsByStudentId(studentId);
	}

}