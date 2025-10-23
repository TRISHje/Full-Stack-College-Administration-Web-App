package com.CAMS.app.Models.Pojo;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.*;

@Entity
public class Fees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int feeId;
    private int studentId;
    private String courseId;
    private double total_amount;
    private double concession_perc;
    private double amount_paid;
    private double remaining_amount;
    private LocalDate payment_date;
    private String installment;
    private int installment_no;
    private String transaction_id;
    private String mode_of_payment;

    @OneToMany(mappedBy = "fees", cascade = CascadeType.ALL)
    private List<Installment> list;

    public String getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(String transaction_id) {
        this.transaction_id = transaction_id;
    }

    public String getMode_of_payment() {
        return mode_of_payment;
    }

    public void setMode_of_payment(String mode_of_payment) {
        this.mode_of_payment = mode_of_payment;
    }

    public double getAmount_paid() {
        return amount_paid;
    }

    public void setAmount_paid(double amount_paid) {
        this.amount_paid = amount_paid;
    }






    public int getInstallment_no() {
        return installment_no;
    }

    public void setInstallment_no(int installment_no) {
        this.installment_no = installment_no;
    }



    public List<Installment> getList() {
        return list;
    }

    public void setList(List<Installment> list) {
        this.list = list;
    }

    public int getFeeId() {
        return feeId;
    }

    public void setFeeId(int feeId) {
        this.feeId = feeId;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public double getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(double total_amount) {
        this.total_amount = total_amount;
    }

    public double getConcession_perc() {
        return concession_perc;
    }

    public void setConcession_perc(double concession_perc) {
        this.concession_perc = concession_perc;
    }

    public double getRemaining_amount() {
        return remaining_amount;
    }

    public void setRemaining_amount(double remaining_amount) {
        this.remaining_amount = remaining_amount;
    }

    public LocalDate getPayment_date() {
        return payment_date;
    }

    public void setPayment_date(LocalDate payment_date) {
        this.payment_date = payment_date;
    }



    public String getInstallment() {
        return installment;
    }

    public void setInstallment(String installment) {
        this.installment = installment;
    }
}
