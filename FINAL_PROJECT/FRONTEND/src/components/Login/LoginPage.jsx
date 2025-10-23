import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link as RouteLink} from 'react-router-dom';

const LoginPage = () => {
  // State for student login form
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // States for general UI feedback
  const [message, setMessage] = useState('');
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [isError, setIsError] = useState(false); // To indicate if the message is an error

  const navigate = useNavigate();

  // Handles student login submission
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setIsLoadingStudent(true); // Set loading for student login
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      // Step 1: Attempt to log in the student
      const loginResponse = await axios.post("http://localhost:8080/users/login", {
        username: studentUsername,
        password: studentPassword
      });

      // Defensive check for loginResponse.data and loginResponse.data.role (singular)
      if (loginResponse.data && typeof loginResponse.data.role === 'string') {
        const rolesArray = [loginResponse.data.role]; // Convert the single role string into an array
        sessionStorage.setItem("token", loginResponse.data.token);
        sessionStorage.setItem("role", JSON.stringify(rolesArray)); // Store as stringified array

        if (rolesArray.includes("ROLE_STUDENT")) {
          // Step 2: If login is successful and user is a student, fetch studentId using the token for authorization
          try {
            const token = sessionStorage.getItem("token"); // Retrieve the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
            };
            // CORRECTED: Use the endpoint that matches the backend: /api/registrations/studentId/
            const studentIdResponse = await axios.get(`http://localhost:8080/student/studentId/${studentUsername}`, config);
            if (studentIdResponse.data) {
              sessionStorage.setItem("studentId", studentIdResponse.data.toString()); // Store studentId as string
              sessionStorage.setItem("username", studentUsername); // Corrected typo: setIem to setItem

              console.log(sessionStorage.getItem('studentId'));
              console.log(sessionStorage.getItem('username'));
              setMessage('Student login successful! Redirecting...');
              // Consider a small delay before navigating for the message to be seen
              setTimeout(() => {
                navigate("/student/dashboard");
              }, 1000);
            } else {
              setMessage("Login successful, but could not retrieve student ID. Please contact support.");
              setIsError(true);
            }
          } catch (studentIdError) {
            console.error('Student ID Fetch Error:', studentIdError);
            // Differentiate error messages based on common HTTP status codes for auth issues
            if (studentIdError.response) {
                if (studentIdError.response.status === 401 || studentIdError.response.status === 403) {
                    setMessage("Authentication error when fetching student ID. Please re-login.");
                } else if (studentIdError.response.status === 404) {
                    setMessage("Student ID endpoint not found. Please ensure backend is running and the endpoint URL is correct.");
                } else {
                    setMessage(studentIdError.response.data.message || "An error occurred while fetching student ID.");
                }
            } else if (studentIdError.request) {
                setMessage("Network error while fetching student ID. Please check your connection.");
            } else {
                setMessage("Login successful, but failed to fetch student ID. Please contact support.");
            }
            setIsError(true);
          }
        } else {
          setMessage("You are not registered as a Student. Please use the Admin login if applicable.");
          setIsError(true);
        }
      } else {
        // This block will execute if loginResponse.data is null/undefined or role is not a string
        setMessage("Login failed: Unexpected response from server. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error('Student Login Error:', error); // Log the full error object for debugging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setMessage(error.response.data.message || "Invalid Student credentials. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error, CORS)
        setMessage("Network error. Please check your connection to the server.");
      } else {
        // Something else happened when setting up the request (e.g., client-side error)
        setMessage("An unexpected error occurred during student login.");
      }
      setIsError(true);
    } finally {
      setIsLoadingStudent(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-8">
        {/* Student Login Form */}
        <form onSubmit={handleStudentLogin} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Login to your Student Account</h2>
          <div className="formGroup">
            <label htmlFor="studentUsername" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="studentUsername"
              placeholder="Enter your username"
              value={studentUsername}
              onChange={(e) => setStudentUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="studentPassword"
              placeholder="Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoadingStudent}
          >
            {isLoadingStudent ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            New User? {' '}
            <RouteLink to='/signup' className='font-medium text-blue-600 hover:text-blue-500 text-decoration-none'>Sign Up</RouteLink>
          </p>
          <p className="text-center text-sm text-gray-600 mt-4">
            Back to Home? {' '}
            <RouteLink to='/' className='font-medium text-blue-600 hover:text-blue-500 text-decoration-none'>Home</RouteLink>
          </p>
        </form>

        {/* Message display for success/error/loading */}
        {message && (
          <p className={`mt-4 p-3 rounded-md text-center text-sm ${isError ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
