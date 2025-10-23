import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom';


export default function GetFees(){
  
    const [fee, setFee] = useState([]);

    useEffect(() =>{
        loadUsers();
    },[]);

    const loadUsers = async() => {
         try {
    const result = await axios.get("http://localhost:8080/fee/getAllFees");
    setFee(result.data);
  } catch (error) {
    console.error("Failed to fetch fees:", error);
    // optionally show error UI or notification here
  }
    }
  return (
  <div className="container mt-5">
  <div className="card shadow-lg border-0">
    <div className="card-header bg-primary text-white">
      <h4 className="mb-0">Fee Records</h4>
    </div>
    <div className="table-responsive">
      <table className="table table-hover table-bordered mb-0 align-middle">
        <thead className="table-primary text-center">
          <tr>
            <th>Fee ID</th>
            <th>Student ID</th>
            <th>Course ID</th>
            <th>Total Amount</th>
            <th>Concession (%)</th>
            <th>Amount Paid</th>
            <th>Remaining Amount</th>
            <th>Payment Date</th>
            <th>Transaction ID</th>
            <th>Mode of Payment</th>
            <th>Installment Type</th>
            <th>No. of Installment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fee.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-4 text-muted">
                <i className="bi bi-exclamation-circle"></i> No fee records available
              </td>
            </tr>
          ) : (
            fee.map((fee) => (
              <tr key={fee.feeId}>
                <td className="text-center">{fee.feeId}</td>
                <td className="text-center">{fee.studentId}</td>
                <td className="text-center">{fee.courseId}</td>
                <td className="text-end">₹{fee.total_amount}</td>
                <td className="text-center">{fee.concession_perc}%</td>
                <td className="text-end text-success">₹{fee.amount_paid}</td>
                <td className="text-end text-danger">₹{fee.remaining_amount}</td>
                <td className="text-center">
                  {fee.payment_date
                    ? new Date(fee.payment_date).toLocaleDateString()
                    : <span className="badge bg-warning text-dark">Not Paid</span>}
                </td>
                <td className="text-center">{fee.transaction_id || "Not Generated Yet"}</td>
                <td className="text-center">{fee.mode_of_payment || "Pending"}</td>
                <td className="text-center">
                  <span className={`badge ${fee.installment === "Yes" ? "bg-success" : "bg-secondary"}`}>
                    {fee.installment || "No"}
                  </span>
                </td>
                <td className="text-center">{fee.installment_no || 0}</td>
                <td className="text-center">
                  <Link
                    className="btn btn-outline-primary btn-sm"
                    to={`/admin/viewFee/${fee.studentId}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
}
