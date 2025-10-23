package com.CAMS.app.Models.DAO.ServiceImpl;



import com.CAMS.app.Models.DAO.Services.*;
import com.CAMS.app.Models.Pojo.*;
import com.CAMS.app.Models.Repositories.*;
import com.CAMS.app.Models.Exceptions.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class FeesServiceImpl implements FeesService {

    @Autowired
    private FeesRepository feesRepo;

    @Autowired
    private InstallmentRepository instRepo;

    @Override
    public Fees addFees(Fees fees) {

        double concessionAmt = (fees.getConcession_perc() / 100.0) * fees.getTotal_amount();
        double netAmount = fees.getTotal_amount() - concessionAmt - fees.getAmount_paid();

            fees.setRemaining_amount(netAmount = netAmount>0? netAmount:0);


//        fees.setPayment_date(LocalDate.now());

        if ("Yes".equalsIgnoreCase(fees.getInstallment())) {
            int numberOfInstallments = fees.getInstallment_no();
            double perInstallmentAmount = netAmount / numberOfInstallments;
            List<Installment> installments = new ArrayList<>();

            for (int i = 0; i < numberOfInstallments; i++) {
                Installment inst = new Installment();
                inst.setInstallment_no(i + 1);
                inst.setInstallment_amount(perInstallmentAmount);
                inst.setDue_date(LocalDate.now().plusMonths(i + 1));
                inst.setPaid("NO");
                inst.setPaid_date(null);// initially unpaid
                inst.setFees(fees); // set reverse link
                installments.add(inst);
            }
            fees.setList(installments); // attach to fees object

    }


        return feesRepo.save(fees);
    }

    @Override
    public Fees getFees(int studentId) {

        return feesRepo.findByStudentId(studentId).orElseThrow(() -> new RuntimeException("Student does not exist"));

    }

    @Override
    public List<Fees> getAllFees() {
        return feesRepo.findAll();
    }


	@Override
	public String payFees(int studentId, double amountPaid, String payment_mode, String transaction_id) {

        Fees fees = feesRepo.findByStudentId(studentId).orElseThrow(() -> new InvalidStudentException("Student Id doesn't Exist"));


        if (!"Yes".equalsIgnoreCase(fees.getInstallment())) {
            double remaining = fees.getRemaining_amount();
            if (amountPaid > remaining) {
                return "Amount exceeds remaining balance.";
            }
            double newAmountPaid = fees.getAmount_paid() + amountPaid;
            fees.setRemaining_amount(remaining - amountPaid);
            fees.setAmount_paid(newAmountPaid);
            fees.setPayment_date(LocalDate.now());
            fees.setMode_of_payment(payment_mode);
            fees.setTransaction_id(transaction_id);
            feesRepo.save(fees);
            return "Payment successful." ;
        } else {
            return "Installment plan is active.";
        }
    }

    @Override
    public Fees updateFees(Fees fees) {
        Fees existingFees = feesRepo.findByStudentId(fees.getStudentId())
                .orElseThrow(() -> new RuntimeException("Fees not found"));

        existingFees.setInstallment(fees.getInstallment());
        existingFees.setInstallment_no(fees.getInstallment_no());

        if ("Yes".equalsIgnoreCase(fees.getInstallment())) {
            int numberOfInstallments = fees.getInstallment_no();
            double perInstallmentAmount = existingFees.getRemaining_amount() / numberOfInstallments;
            List<Installment> installments = new ArrayList<>();

            for (int i = 0; i < numberOfInstallments; i++) {
                Installment inst = new Installment();
                inst.setInstallment_no(i + 1);
                inst.setInstallment_amount(perInstallmentAmount);
                inst.setDue_date(LocalDate.now().plusMonths(i + 1));
                inst.setPaid("NO");
                inst.setPaid_date(null);// initially unpaid
                inst.setFees(existingFees); // set reverse link
                installments.add(inst);
            }
            existingFees.setList(installments);
        }
        return feesRepo.save(existingFees);// attach to fees object
    }



}
