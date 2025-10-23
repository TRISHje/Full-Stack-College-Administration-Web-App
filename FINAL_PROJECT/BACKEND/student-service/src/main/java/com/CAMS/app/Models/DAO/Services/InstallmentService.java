package com.CAMS.app.Models.DAO.Services;

import com.CAMS.app.Models.Pojo.*;

import java.util.List;

public interface InstallmentService {
	List<Installment> getInstallment( int feeId);

    List<Installment> getAllInstallments();

    String payInstallment(int installmentId, double amount, String paymentMode, String transactionId);

    Installment getInstallmentById(int installmentId);
}
