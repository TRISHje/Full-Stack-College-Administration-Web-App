/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';

// const studentId = sessionStorage.getItem('studentId');



const FeeDetailItem = ({ label, value }) => (
  <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm transition-transform transform hover:scale-105">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-xl font-bold text-gray-800 mt-1">{value}</span>
  </div>
);

export default function ViewFee() {
  const token = sessionStorage.getItem('token');
  const [fee, setFee] = useState(null);
 const { studentId }= useParams();
  useEffect(() => {
    loadUserFees();
  }, []);

  const loadUserFees = async () => {
    console.log("Fetching fees for id:", studentId);
    try {
      console.log("In try block");
      const result = await axios.get(`http://localhost:8080/fee/getFees/${studentId}`, {
        headers :{
          Authorization : `Bearer ${token}`
        }
      });
      console.log("API response:", result.data);
      setFee(result.data);
    } catch (error) {
      console.error("Failed to fetch fees:", error);
    }
  };

  return (
   <div className="p-6 bg-gray-100 min-h-screen">
  {fee ? (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <h3 className="text-l font-semibold">Fee Details</h3>
      </div>
      {fee.remaining_amount === 0 ? (

     <div className="p-6 bg-green-100 text-green-700 font-bold flex items-center justify-center text-2xl m-4 rounded-lg border-2 border-green-300">
              <span className="text-4xl mr-3">✅</span>
              Payment Completed
            </div>

 ) :
 (
  <div className="p-6 bg-yellow-100 text-yellow-700 font-bold flex items-center justify-center text-2xl m-4 rounded-lg border-2 border-yellow-300">
              <span className="text-4xl mr-3">⏳</span>
              Payment Pending
            </div>
  
)}
      <div className="p-6">
        {/* Fee General Info */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">General Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <FeeDetailItem label="Student ID" value={fee.studentId} />
                <FeeDetailItem label="Course ID" value={fee.courseId} />
                <FeeDetailItem label="Total Amount" value={`₹${fee.total_amount - (fee.concession_perc / 100 * fee.total_amount)}`} />
                <FeeDetailItem label="Amount Paid" value={`₹${fee.amount_paid.toFixed(2)}`} />
          {fee.remaining_amount === 0 && (
                  <>
                    <FeeDetailItem label="Mode Of Payment" value={fee.mode_of_payment} />
                    <FeeDetailItem label="Transaction ID" value={fee.transaction_id} />
                  </>
                )}
          <FeeDetailItem label="Remaining Amount" value={`₹${fee.remaining_amount.toFixed(2)}`} />
                <FeeDetailItem label="Date of Payment" value={fee.payment_date || "Not Paid yet"} />
                <FeeDetailItem label="Installment Plan" value={fee.installment === "Yes" ? "Active" : "Inactive"} />
         {fee.installment === "Yes" && (
                  <>
                    
                    <FeeDetailItem label="Installments Remaining" value={fee.installment_no} />
                  </>
                )}
        </div>
        </div>

        {/* Installments Table */}
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Installments</h4>
            <div className="overflow-x-auto">
       <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Installment ID</th>
                    <th className="py-3 px-4 text-left">Installment No</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Due Date</th>
                    <th className="py-3 px-4 text-left">Paid Date</th>
                    <th className="py-3 px-4 text-left">Paid</th>
                    <th className="py-3 px-4 text-left">Transaction ID</th>
                    <th className="py-3 px-4 text-left">Mode Of Payment</th>
                    
                  </tr>
                </thead>
          <tbody>
                  {fee.list?.length ? (
                    fee.list.map((inst, index) => (
                      <tr key={inst.installmentId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4">{inst.installmentId}</td>
                        <td className="py-3 px-4">{inst.installment_no}</td>
                        <td className="py-3 px-4">₹{inst.installment_amount.toFixed(2)}</td>
                        <td className="py-3 px-4">{inst.due_date}</td>
                        <td className="py-3 px-4">{inst.paid_date || "Not Paid"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              inst.paid === "YES" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                            }`}
                          >
                            {inst.paid}
                          </span>
                        </td>
                  <td className="py-3 px-4">{inst.transaction_id || "Not Generated Yet" }</td>
                        <td className="py-3 px-4">{inst.mode_of_payment || "Pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No installments found
                </td>
              </tr>
            )}
          </tbody>
        </table>


      </div>
    </div>
    </div>
  ) : (
    <div className="alert alert-info mt-4">Loading fee details...</div>
  )}
</div>

  );
};
