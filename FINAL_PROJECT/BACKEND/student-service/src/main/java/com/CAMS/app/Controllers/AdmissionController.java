package com.CAMS.app.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import com.CAMS.app.Models.DAO.Services.AdmissionService;
import com.CAMS.app.Models.Pojo.Admission;
import com.CAMS.app.Models.Repositories.AdmissionRepository;

@RestController
@RequestMapping("/admissions")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;

    @Autowired
    private AdmissionRepository admissionRepository;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAllAdmissions")
    public List<Admission> getAllAdmissions(){
        return admissionService.getAllAdmissions();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAdmission/{admissionId}")
    public ResponseEntity<Admission> getAdmissionById(@PathVariable int admissionId) {
        Optional<Admission> admission = admissionService.getAdmissionById(admissionId);
        return admission.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAdmissionByStatus/{status}")
    public ResponseEntity<List<Admission>> getAdmissionsByStatus(@PathVariable String status) {
        List<Admission> admissions = admissionService.getAdmissionsByStatus(status);
        if (admissions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(admissions);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getAdmissionByCourse/{course}")
    public ResponseEntity<List<Admission>> getAdmissionByCourse(@PathVariable String course){
        List<Admission> admissions = admissionService.getAdmissionByCourse(course);
        if (admissions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(admissions);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/addAdmission/{studentId}")
    public ResponseEntity<?> addAdmission(@RequestBody Admission admission, @PathVariable int studentId) {
        try {
            Admission newAdmission = admissionService.addAdmission(admission, studentId);
            return new ResponseEntity<>(newAdmission, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updateAdmission/{admissionId}")
    public ResponseEntity<Admission> updateAdmission(@PathVariable int admissionId, @RequestBody Admission admissionDetails) {
        try {
            Admission updatedAdmission = admissionService.updateAdmission(admissionId, admissionDetails);
            return ResponseEntity.ok(updatedAdmission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteAdmission/{admissionId}")
    public ResponseEntity<Void> deleteAdmission(@PathVariable int admissionId) {
        admissionService.deleteAdmission(admissionId);
        return ResponseEntity.noContent().build();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public Map<String, Long> getApplicationStats() {
    	Map<String, Long> stats = new HashMap<>();

    	stats.put("total", admissionRepository.count());
    	stats.put("pending", admissionRepository.countByStatus("PENDING"));
    	stats.put("accepted", admissionRepository.countByStatus("ACCEPTED"));
    	stats.put("rejected", admissionRepository.countByStatus("REJECTED"));
    	return stats;
    }
    
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/getAdmissions/{studentId}")
    public ResponseEntity<List<Admission>> getAdmissionsByStudentId(@PathVariable int studentId) {
        List<Admission> admissions = admissionService.getAdmissionsByStudentId(studentId);
        if (admissions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(admissions);
    }

}