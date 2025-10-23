/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css'; // Import the CSS file


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    courseName: '',
    marks10: '',
    marks12: '',
  });
  const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');
    const config = {
        headers: {
        Authorization: `Bearer ${token}`
        }
    };
  const [tenthMarksheet, setTenthMarksheet] = useState(null);
  const [twelfthMarksheet, setTwelfthMarksheet] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const basicInfoResponse = await axios.get(`http://localhost:8080/student/basic-info/${username}`);
        setFormData(prevData => ({
          ...prevData,
          name: basicInfoResponse.data.name,
          email: basicInfoResponse.data.email,
        }));

        const coursesResponse = await axios.get('http://localhost:8080/courses/getAllCourses');
        setCourses(coursesResponse.data);

const statusResponse = await axios.get(`http://localhost:8080/student/status/${username}`);
        if (statusResponse.data == 'Approval Pending') {
          setIsSubmitted(true);
        }



        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        // setError('Failed to load initial data. Please try again.');
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [username]);

  const handleChange = (e) => {
   const { name, value } = e.target;
  if (name === 'courseId') {
    // Find the course object that matches the selected ID
    const selectedCourse = courses.find(course => course.id === parseInt(value));
    if (selectedCourse) {
      // Update the state with the courseName
      setFormData({
        ...formData,
        courseName: selectedCourse.courseName
      });
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'tenth') {
      setTenthMarksheet(files[0]);
    } else {
      setTwelfthMarksheet(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!tenthMarksheet || !twelfthMarksheet) {
      setError('Please upload both 10th and 12th marksheets.');
      setSubmitting(false);
      return;
    }

    try {
      await axios.put(`http://localhost:8080/student/complete-registration/${username}`,formData);
      const formDataFiles = new FormData();
      formDataFiles.append('tenth', tenthMarksheet);
      formDataFiles.append('twelfth', twelfthMarksheet);
      await axios.post(`http://localhost:8080/student/upload-documents/${username}`, formDataFiles, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Registration and documents submitted successfully!');
      setTenthMarksheet(null);
      setTwelfthMarksheet(null);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit registration. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container" style={{ textAlign: 'center' }}>
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

 return (
  <div className="form-container">
    <div className="form-card">
      {/* Conditionally render the title based on the state */}
      <h2 className="form-title">
        {isSubmitted ? 'Application Already Submitted' : 'Student Application Form'}
      </h2>
      {error && <p className="error-message">{error}</p>}
      
      {/* Main conditional rendering logic */}
      {isSubmitted ? (
        <div className="submission-message">
          <p>Your application has already been submitted.</p>
          <p>Thank you for completing the registration process.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* All your form content will be inside this <form> tag */}
          <div className="form-section">
            <h3 className="section-title">Personal Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} disabled />
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} disabled />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3 className="section-title">Academic Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>10th Marks (%)</label>
                <input type="number" name="marks10" value={formData.marks10} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>12th Marks (%)</label>
                <input type="number" name="marks12" value={formData.marks12} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Program Applying For</label>
                <select name="courseName" value={formData.courseName} onChange={handleChange} required>
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <p className='text-red-500'><strong>Note:</strong> Check all the courses and fees before selecting the Course. Once it's selected it cannot be changed further.</p>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3 className="section-title">Document Upload</h3>
            <div className="form-grid">
              <div className="form-field file-input-container">
                <label>10th Marksheet:</label>
                <div className="file-input-wrapper">
                  <input type="file" name="tenth" onChange={handleFileChange} required />
                  <span className="file-name">{tenthMarksheet ? tenthMarksheet.name : 'No file chosen'}</span>
                </div>
              </div>
              <div className="form-field file-input-container">
                <label>12th Marksheet:</label>
                <div className="file-input-wrapper">
                  <input type="file" name="twelfth" onChange={handleFileChange} required />
                  <span className="file-name">{twelfthMarksheet ? twelfthMarksheet.name : 'No file chosen'}</span>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Apply'}
          </button>
        </form>
      )}
    </div>
  </div>
);
};

export default Register;