/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function StudentInstallment () {
const { feeId } = useParams();
  const [ installment, setInstallment] = useState(null);

  useEffect(() => {
    loadUserInstallment();
  }, []);

  const loadUserInstallment = async () => {
    
    try {
      console.log("In try block");
      const result = await axios.get(`http://localhost:8080/installment/getInstallment/${feeId}`);
     
      setInstallment(result.data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    }
  };
  return (
  <div className="container mt-4">
  {!installment ? (
    <div className="alert alert-info">Loading installments...</div>
  ) : installment.length === 0 ? (
    <div className="alert alert-warning">No installments found.</div>
  ) : (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Installments</h3>
        <Link
          className="btn btn-success btn-sm"
          to="/student/payInstallment"
        >
          💳 Pay Installment
        </Link>
      </div>

      <div className="card-body">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Installment ID</th>
              <th>Installment No</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {installment.map((inst) => (
              <tr key={inst.installmentId}>
                <td>{inst.installmentId}</td>
                <td>{inst.installment_no}</td>
                <td>₹{inst.installment_amount}</td>
                <td>
                  {inst.due_date
                    ? new Date(inst.due_date).toLocaleDateString()
                    : "Not Set"}
                </td>
                <td>
                  <span
                    className={`badge ${
                      inst.paid === "YES" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {inst.paid}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>

);
}
