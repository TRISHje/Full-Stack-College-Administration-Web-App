import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function PayFees() {
    const { studentId } = useParams();
    const location = useLocation();
    const { amount } = location.state || {};
    const [payment, setPayment] = useState("");
    const [transaction, setTransaction] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Fetch token and create config inside the component to ensure it's up-to-date
    const token = sessionStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!payment.trim() || !transaction.trim()) {
            setError("Please fill in all fields (Payment Mode and Transaction ID).");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/fee/payFees/${studentId}`,
                {
                    amount: parseFloat(amount),
                    mode_of_payment: payment.trim(),
                    transaction_id: transaction.trim()
                },
                config // ✅ Correctly placed as the config object
            );

            setMessage(response.data);
            setTransaction("");
            setPayment("");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.detail || err.response.data.title || "An unknown error occurred.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Pay Fees</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">
                                Amount Due
                            </label>
                            <input
                                type="number"
                                id="amount"
                                step="0.01"
                                className="form-control"
                                value={amount || ''} // Use empty string for better controlled component behavior
                                disabled
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
                                Transaction ID
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

                        <button type="submit" className="btn btn-success">
                            💰 Pay
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