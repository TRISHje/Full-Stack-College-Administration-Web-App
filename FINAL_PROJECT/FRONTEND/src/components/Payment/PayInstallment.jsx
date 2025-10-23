/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function PayInstallment () {
  const { studentId, installmentId: paramInstallmentId } = useParams();
  const [installmentId, setInstallmentId] = useState(paramInstallmentId || "");
  const [amount, setAmount] = useState(""); // This will store the fetched amount, which needs to be parsed as a number
  const [payment, setPayment] = useState("");
  const [transaction, setTransaction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (paramInstallmentId) {
      console.log("Fetching installment details for ID:", paramInstallmentId);
      const token = sessionStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      axios.get(`http://localhost:8080/installment/getInstallmentById/${paramInstallmentId}`, config)
        .then(res => {
          // Parse the fetched amount to a float immediately
          setAmount(parseFloat(res.data.installment_amount));
        })
        .catch(err => {
          console.error("Error fetching installment details:", err);
          setError("Failed to load installment details.");
        });
    }
  }, [paramInstallmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate inputs. The 'amount' should ideally be fetched and present from useEffect.
    if (amount === "" || isNaN(amount) || !payment.trim() || !transaction.trim()) {
      setError("Please ensure the amount is loaded, and fill in Payment Mode and Transaction ID.");
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    try {
      const response = await axios.post(
        `http://localhost:8080/installment/payInstallment`,
        { 
          installmentId: parseInt(installmentId, 10), // Ensure installmentId is an integer
          amount: parseFloat(amount), // Ensure amount is a float before sending
          mode_of_payment: payment.trim(), 
          transaction_id: transaction.trim()
        },
        config
      );
      
      setMessage(response.data); 
      setTransaction("");
      setPayment("");
    } catch (err) {
      console.error("Error paying installment:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || err.response.data.title || err.response.data || "Unknown error occurred.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Pay Installment</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="installmentId" className="form-label">
                Installment ID
              </label>
              <input
                type="number"
                id="installmentId"
                className="form-control"
                value={installmentId}
                disabled // Installment ID is from URL params, not user input
              />
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount to Pay
              </label>
              <input
                type="number"
                id="amount"
                className="form-control"
                // Safely call toFixed() only if amount is a number, otherwise show empty string
                value={typeof amount === 'number' && !isNaN(amount) ? amount.toFixed(2) : ''}
                disabled // Amount is fetched from API, not user input
              />
            </div>

            <div className="mb-3">
              <label htmlFor="payment" className="form-label">
                Payment Mode
              </label>
              <input
                type="text"
                id="payment"
                className="form-control"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="transaction" className="form-label">
                Transaction ID:
              </label>
              <input
                type="text"
                id="transaction"
                className="form-control"
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              💵 Pay Installment
            </button>
          </form>

          {message && (
            <div className="alert alert-success mt-4" role="alert">
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

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
