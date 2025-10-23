/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PreviewStatus.css';

const PreviewStatus = () => {
    const [studentData, setStudentData] = useState(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const username = sessionStorage.getItem('username');
    const studentId = sessionStorage.getItem('studentId');
    const token = sessionStorage.getItem('token');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch student preview data
                const previewResponse = await axios.get(`http://localhost:8080/student/preview/${username}`, config);
                setStudentData(previewResponse.data);

                // Fetch admission details
                const admissionResponse = await axios.get(`http://localhost:8080/admissions/getAdmissions/${studentId}`, config);
                const admissionData = admissionResponse.data;

                // The API returns an array, so we need to access the first element
                const admission = admissionData[admissionData.length-1];
               

                if (admission && admission.status === 'ACCEPTED') {
                    // Fetch fees only if admission is 'ACCEPTED'
                    const feesResponse = await axios.get(`http://localhost:8080/fee/getFees/${studentId}`, config);
                    const feeData = feesResponse.data;

                    if (feeData && feeData.remaining_amount.toFixed(2) == 0) {
                        setStatus('Admission Completed');
                    } else {
                        setStatus('Application Accepted. Pay Fees');
                    }
                } else if (admission && admission.status === 'PENDING') {
                    setStatus('Approval Pending');
                } 
                else if (admission && admission.status === 'REJECTED') {
                    setStatus('Application Rejected');
                } 

                else {
                    setStatus('Please apply for admission to view your status.');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response && err.response.status === 404) {
                    setError('Please complete the registration and apply for admission.');
                } else {
                    setError('Failed to load student data. Please try again later.');
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [username, studentId, token]);

    const handleDownload = (documentType) => {
        const url = `http://localhost:8080/student/download/${username}/${documentType}`;
        window.open(url, '_blank');
    };

    const statusClass = status === 'Admission Completed' ? 'bg-success text-white' : 'bg-primary text-white';

    if (loading) {
        return <div className="dashboard-container loading-container">Loading data...</div>;
    }

    if (error) {
        return <div className="dashboard-container error-container">{error}</div>;
    }

    if (!studentData) {
        return <div className="dashboard-container no-data-container">No student data found.</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <h2 className="dashboard-title">Application Details</h2>
                <div className="status-section">
                    <h3 className="section-heading">Application Status</h3>
                    <div className={`status-box ${statusClass}`}>
                        <p>{status}</p>
                    </div>
                </div>
                <div className="preview-section">
                    <h3 className="section-heading">Personal Details</h3>
                    <div className="details-grid">
                        <p><strong>Name:</strong> {studentData.name}</p>
                        <p><strong>Email:</strong> {studentData.email}</p>
                        <p><strong>Phone:</strong> {studentData.phoneNo}</p>
                        <p><strong>DOB:</strong> {studentData.dob}</p>
                        <p><strong>Gender:</strong> {studentData.gender}</p>
                        <p><strong>Address:</strong> {studentData.address}</p>
                        <p><strong>City:</strong> {studentData.city}</p>
                        <p><strong>State:</strong> {studentData.state}</p>
                    </div>
                </div>
                <div className="preview-section">
                    <h3 className="section-heading">Academic Information</h3>
                    <div className="details-grid">
                        <p><strong>10th Marks:</strong> {studentData.marks10}%</p>
                        <p><strong>12th Marks:</strong> {studentData.marks12}%</p>
                        <p><strong>Course:</strong> {studentData.courseName}</p>
                    </div>
                </div>
                <div className="documents-section">
                    <h3 className="section-heading">Uploaded Documents</h3>
                    <div className="document-links">
                        <button onClick={() => handleDownload('10th')} className="document-button">
                            View 10th Marksheet
                        </button>
                        <button onClick={() => handleDownload('12th')} className="document-button">
                            View 12th Marksheet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewStatus;