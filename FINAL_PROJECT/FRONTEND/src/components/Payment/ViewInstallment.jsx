/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function ViewInstallment () {
    const { feeId } = useParams();
  const [ installment, setInstallment] = useState(null);

  useEffect(() => {
    loadUserInstallment();
  }, []);

  const loadUserInstallment = async () => {
    
    try {
      console.log("In try block");
      const result = await axios.get(`http://localhost:8080/installment/getInstallment/${feeId}`);
      console.log("API response:", result.data);
      setInstallment(result.data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    }
  };
  return (
<div className="container mt-4">
  <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
    <div className="card-header bg-primary text-white py-3">
      <h3 className="mb-0 fw-semibold">Installments</h3>
    </div>
    <div className="card-body p-0">
      {!installment ? (
        <div className="alert alert-info m-3">Loading installments...</div>
      ) : installment.length === 0 ? (
        <div className="alert alert-warning m-3">No installments found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-borderless align-middle mb-0">
            <thead className="table-dark sticky-top">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">No.</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Due Date</th>
                <th className="text-center">Status</th>
                <th className="text-center">Transaction</th>
                <th className="text-center">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {installment.map((inst) => (
                <tr key={inst.installmentId}>
                  <td className="text-center fw-semibold">{inst.installmentId}</td>
                  <td className="text-center">{inst.installment_no}</td>
                  <td className="text-center text-success fw-semibold">
                    ₹{Number(inst.installment_amount).toLocaleString("en-IN")}
                  </td>
                  <td className="text-center">
                    {new Date(inst.due_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="text-center">
                    {inst.paid==="YES"? (
                      <span className="badge bg-success px-3 py-2">Paid</span>
                    ) : (
                      <span className="badge bg-danger px-3 py-2">Pending</span>
                    )}
                  </td>
                  <td className="text-center text-muted">
                    {inst.transaction_id || "Not Generated Yet"}
                  </td>
                  <td className="text-center text-muted">
                    {inst.mode_of_payment || "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</div>


);
}
