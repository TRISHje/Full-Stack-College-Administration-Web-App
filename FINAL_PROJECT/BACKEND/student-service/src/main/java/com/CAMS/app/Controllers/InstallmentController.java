package com.CAMS.app.Controllers;


import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Models.DAO.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.CAMS.app.Models.DTO.*;

import java.util.List;

@Controller
@RequestMapping("/installment")
public class InstallmentController {

    @Autowired
    private InstallmentService installmentService;

    @GetMapping("/getInstallment/{feeId}")
    public ResponseEntity<List<Installment>> getInstallment(@PathVariable int feeId){
    return ResponseEntity.ok(installmentService.getInstallment(feeId));
    }

@GetMapping("/getInstallmentById/{installmentId}")
public ResponseEntity<Installment> getInstallmentById(@PathVariable int installmentId){
    return ResponseEntity.ok(installmentService.getInstallmentById(installmentId));
}

    @GetMapping("/getAllInstallments")
public ResponseEntity<List<Installment>> getAllInstallments(){
      return ResponseEntity.ok(installmentService.getAllInstallments());
    }

    @PostMapping("/payInstallment")
public ResponseEntity<String> payInstallment(@RequestBody InstallmentRequest request){
    return ResponseEntity.ok(installmentService.payInstallment(request.getInstallmentId(),request.getAmount(), request.getMode_of_payment(), request.getTransaction_id()));
    }
}
