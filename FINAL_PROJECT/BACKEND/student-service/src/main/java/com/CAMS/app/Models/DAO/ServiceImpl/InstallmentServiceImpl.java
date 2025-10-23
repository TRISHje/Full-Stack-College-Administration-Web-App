package com.CAMS.app.Models.DAO.ServiceImpl;

import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Models.Repositories.*;
import com.CAMS.app.Models.Exceptions.*;
import com.CAMS.app.Models.DAO.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InstallmentServiceImpl implements InstallmentService {

    @Autowired
    private InstallmentRepository installmentRepository;

    @Autowired
    private FeesRepository feesRepository;

    @Override
    public List<Installment> getInstallment(int feeId) {
        Fees fees = feesRepository.findByFeeId(feeId).orElseThrow(() -> new RuntimeException("Student Id does not exist"));
        return fees.getList();
    }

    @Override
    public List<Installment> getAllInstallments() {
        return installmentRepository.findAll();
    }


    @Override
    public String payInstallment(int installmentId, double amount , String paymentMode, String transactionId) {
        Installment inst = installmentRepository.findById(installmentId)
                .orElseThrow(() -> new InvalidInstalllmentIdException("Installment not found, Please Provide correct InstallmentID, get it from /getInstallment"));

        if (inst.getPaid_date() != null) {
            return "Installment already paid.";
        }

        if (amount != inst.getInstallment_amount()) {
            return "Amount should be exactly: " + inst.getInstallment_amount();
        }
        inst.setTransaction_id(transactionId);
        inst.setMode_of_payment(paymentMode);
        inst.setPaid_date(LocalDate.now());
        inst.setPaid("YES");
        installmentRepository.save(inst);

        // update fees remaining amount
        Fees fees = inst.getFees();
        fees.setAmount_paid(fees.getAmount_paid()+amount);
        fees.setInstallment_no(fees.getInstallment_no() -1);
        fees.setRemaining_amount(fees.getRemaining_amount() - amount);
        fees.setPayment_date(LocalDate.now());
        fees.setTransaction_id(transactionId);
        fees.setMode_of_payment(paymentMode);
        feesRepository.save(fees);

        return "Installment payment successful. Remaining amount: " + fees.getRemaining_amount();
    }

    @Override
    public Installment getInstallmentById(int installmentId) {
        return installmentRepository.findById(installmentId).orElseThrow(() -> new InvalidInstalllmentIdException("Installment Id does not exist"));
    }

}
