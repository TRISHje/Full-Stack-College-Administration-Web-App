/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link, useParams } from 'react-router-dom';

export default function GetInstallment() {
  
     const {id} = useParams();
   
    const [installment, setInstallment] = useState([]);

    useEffect(() =>{
        loadInstallment();
    },[]);

    const loadInstallment = async() => {
         try {
    const result = await axios.get("http://localhost:8080/installment/getAllInstallments");
    setInstallment(result.data);
  } catch (error) {
    console.error("Failed to fetch Installment:", error);
    // optionally show error UI or notification here
  }
    }
  return (
    <div className="container mt-5">
  <div className="card shadow-lg border-0">
    <div className="card-header bg-secondary text-white">
      <h4 className="mb-0">Installments</h4>
    </div>
    <div className="table-responsive">
      <table className="table table-hover table-bordered mb-0 align-middle">
        <thead className="table-secondary text-center">
          <tr>
            <th>Installment ID</th>
            <th>Installment No</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Paid Date</th>
            <th>Status</th>
            <th>Transaction ID</th>
            <th>Mode Of Payment</th>
            <th>Fee ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {installment.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-muted">
                <i className="bi bi-exclamation-circle"></i> No installments found
              </td>
            </tr>
          ) : (
            installment.map((inst) => (
              <tr key={inst.installmentId}>
                <td className="text-center">{inst.installmentId}</td>
                <td className="text-center">{inst.installment_no}</td>
                <td className="text-end">₹{inst.installment_amount}</td>
                <td className="text-center">
                  {inst.due_date
                    ? new Date(inst.due_date).toLocaleDateString()
                    : "NA"}
                </td>
                <td className="text-center">
                  {inst.paid_date
                    ? new Date(inst.paid_date).toLocaleDateString()
                    : <span className="badge bg-warning text-dark">Not Paid</span>}
                </td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      inst.paid === "YES" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {inst.paid}
                  </span>
                </td>
                <td className="text-center">{inst.transaction_id || "Not Generated Yet" }</td>
                <td className="text-center">{inst.mode_of_payment || "Pending"}</td>
                <td className="text-center">{inst.feeId || "NA"}</td>
                <td className="text-center">
                  <Link
                    className="btn btn-outline-primary btn-sm"
                    to={`/viewInstallment/${inst.feeId}`}
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
