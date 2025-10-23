package com.CAMS.app.Controllers;


import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Models.DTO.*;
import com.CAMS.app.Models.DAO.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fee")
public class FeesController {

    @Autowired
    private FeesService feesService;

    @PostMapping("/addFees")
    public ResponseEntity<Fees> addFees(@RequestBody Fees fees){
        return ResponseEntity.ok(feesService.addFees(fees));
    }

    @PutMapping("/updateFees")
    public ResponseEntity<Fees> updatedFees(@RequestBody Fees fees){
        return ResponseEntity.ok(feesService.updateFees(fees));
    }

    @GetMapping("/getAllFees")
    public ResponseEntity<List<Fees>> getAllFees(){
        return ResponseEntity.ok(feesService.getAllFees());
    }


    @GetMapping("/getFees/{studentId}")
    public ResponseEntity<Fees> getFees(@PathVariable int studentId){
        return ResponseEntity.ok(feesService.getFees(studentId));
    }

    @PostMapping("/payFees/{studentId}")
    public ResponseEntity<String> payFees(@PathVariable int studentId, @RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(feesService.payFees(studentId,paymentRequest.getAmount(), paymentRequest.getMode_of_payment(), paymentRequest.getTransaction_id()));


    }


}

