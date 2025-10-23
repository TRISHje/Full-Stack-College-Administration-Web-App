/* eslint-disable no-unused-vars */


import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
// import { Link } from 'react-router-dom'; 
import { Link as RouteLink} from 'react-router-dom'; 

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Creating account...');

    try {
      // API endpoint for creating a new student account
      const API_URL = 'http://localhost:8080/student/create-account';
      console.log("getting to the API")
      const response = await axios.post(API_URL, formData);
      console.log(response.status)
      
      // Check if the response was successful
      if (response.status === 201) { // 201 Created is a common success status for creation
         const NewUsername = response.data.username;
        
        setUsername(NewUsername); // <-- Set the username state
        setMessage(`Account created successfully! Your username is: ${NewUsername}.`);
        // You might want to redirect the user here
        // For example: window.location.href = '/login';
        
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      // Handle errors, such as network issues or a 4xx/5xx status code from the backend
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error:', error.response.data);
        setMessage(error.response.data.message || 'Error creating account. Please check your details.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error:', error.request);
        setMessage('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup">
      
    <div className="signupContainer">
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input
            placeholder='Enter full name'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
           placeholder='Enter email'
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
             placeholder='Enter password'
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submitButton">
          Sign Up
        </button>

       <p className="login-link">
          Already have an account? &ensp;<RouteLink to='/login' className='text-decoration-none'>Login</RouteLink>
        </p>
       <p className="login-link">
          Back to Home? &ensp;<RouteLink to='/' className='text-decoration-none'>Home</RouteLink>
        </p>

        {message && <p className="message">{message}</p>}

      </form>
    </div>
    </div>
  );
};

export default SignUp;