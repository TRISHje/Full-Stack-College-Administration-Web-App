import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateFee (){
    const navigate = useNavigate();
  const { studentId } = useParams();
  const [installmentOption, setInstallmentOption] = useState("No");
  const [installmentNo, setInstallmentNo] = useState(1);
  const [message, setMessage] = useState("");

  const handleUpdateFees = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        studentId: studentId,
        installment: installmentOption,
        installment_no: installmentOption === "Yes" ? parseInt(installmentNo,10) : 0
      };
     console.log("hello");
      const response = await axios.put(
        "http://localhost:8080/fee/updateFees",
        payload
      );
      console.log("fetched");

      setMessage(`Fees updated successfully! Installments: ${response.data.installment_no}`);
    } catch (error) {
      console.error(error);
      setMessage("Error updating fees. Check console for details.");
    }
  };

  return (
    <div className="container mt-5">
  <div className="card shadow-lg border-0 p-4 mx-auto" style={{ maxWidth: "500px" }}>
    <h3 className="card-title text-center text-primary fw-bold mb-2">
      Update Fees
    </h3>
    <p className="text-center text-muted mb-4">
      Student ID: <span className="fw-semibold">{studentId}</span>
    </p>

    <form onSubmit={handleUpdateFees}>
      {/* Installment Option */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Installment Option</label>
        <select
          className="form-select shadow-sm"
          value={installmentOption}
          onChange={(e) => setInstallmentOption(e.target.value)}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Number of Installments */}
      {installmentOption === "Yes" && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Number of Installments</label>
          <input
            type="number"
            min="1"
            className="form-control shadow-sm"
            value={installmentNo}
            onChange={(e) => setInstallmentNo(e.target.value)}
            required
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary btn-lg shadow-sm">
          💾 Update Fees
        </button>
        
      </div>
    </form>

    {/* Success / Info Message */}
    {message && (
      <div className="alert alert-success text-center mt-4 fw-semibold shadow-sm" role="alert">
        ✅ {message}
        <div className="mt-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate(`/student/getFees/${studentId}`)}
            >
              View Fee Details
            </button>
          </div>
      </div>
    )}
  </div>
</div>

  );
};
