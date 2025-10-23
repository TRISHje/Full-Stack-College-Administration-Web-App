package com.CAMS.app.Models.DAO.Services;


import com.CAMS.app.Models.Pojo.*;

import java.util.List;

public interface FeesService {
    Fees getFees(int studentId);

    List<Fees> getAllFees();



    Fees addFees(Fees fees);


	Fees updateFees(Fees fees);

	String payFees(int studentId, double amount, String mode_of_payment, String transaction_id);
}
