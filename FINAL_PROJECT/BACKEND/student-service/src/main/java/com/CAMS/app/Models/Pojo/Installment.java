package com.CAMS.app.Models.Pojo;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Installment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int InstallmentId; //due to autoboxing should change to INTEGER DIRECTLY

    private int installment_no;
    private double installment_amount;
    private LocalDate due_date;
    private LocalDate paid_date;
    private String paid;
    private String mode_of_payment;
    private String transaction_id;

    public String getMode_of_payment() {
        return mode_of_payment;
    }

    public void setMode_of_payment(String mode_of_payment) {
        this.mode_of_payment = mode_of_payment;
    }

    public String getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(String transaction_id) {
        this.transaction_id = transaction_id;
    }

    @ManyToOne
    @JoinColumn(name="Fee_id")
    @JsonBackReference
    private Fees fees;

    public int getInstallmentId() {
        return InstallmentId;
    }

    public void setInstallmentId(int installmentId) {
        InstallmentId = installmentId;
    }

    public Fees getFees() {
        return fees;
    }
    public Integer getFeeId() {
        return fees != null ? fees.getFeeId() : null;
    }

    public void setFees(Fees fees) {
        this.fees = fees;
    }

    public String getPaid() {
        return paid;
    }

    public void setPaid(String paid) {
        this.paid = paid;
    }

    public int getInstallment_no() {
        return installment_no;
    }

    public void setInstallment_no(int installment_no) {
        this.installment_no = installment_no;
    }

    public double getInstallment_amount() {
        return installment_amount;
    }

    public void setInstallment_amount(double installment_amount) {
        this.installment_amount = installment_amount;
    }

    public LocalDate getDue_date() {
        return due_date;
    }

    public void setDue_date(LocalDate due_date) {
        this.due_date = due_date;
    }

    public LocalDate getPaid_date() {
        return paid_date;
    }

    public void setPaid_date(LocalDate paid_date) {
        this.paid_date= paid_date;
    }
}
