import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link as RouteLink} from 'react-router-dom';

const AdminLoginPage = () => {
  // State for admin login form
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // States for general UI feedback
  const [message, setMessage] = useState('');
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isError, setIsError] = useState(false); // To indicate if the message is an error

  const navigate = useNavigate();

  // Handles admin login submission
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoadingAdmin(true); // Set loading for admin login
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        username: adminUsername,
        password: adminPassword
      });

      // Defensive check for response.data and response.data.role (singular)
      if (response.data && typeof response.data.role === 'string') {
        const rolesArray = [response.data.role]; // Convert the single role string into an array
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("role", JSON.stringify(rolesArray)); // Store as stringified array
        console.log(rolesArray);
        console.log(sessionStorage.getItem('token'));

        if (rolesArray.includes("ROLE_ADMIN")) {
          setMessage('Admin login successful! Redirecting...');
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);
        } else {
          setMessage("You are not registered as an Admin. Please try again with valid admin credentials.");
          setIsError(true);
        }
      } else {
        // This block will execute if response.data is null/undefined or role is not a string
        setMessage("Login failed: Unexpected response from server. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error('Admin Login Error:', error); // Log the full error object for debugging
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setMessage(error.response.data.message || "Invalid Admin credentials. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error, CORS)
        setMessage("Network error. Please check your connection to the server.");
      } else {
        // Something else happened when setting up the request (e.g., client-side error)
        setMessage("An unexpected error occurred during admin login.");
      }
      setIsError(true);
    } finally {
      setIsLoadingAdmin(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-8">
        {/* Admin Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>
          <div className="formGroup">
            <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
            <input
              type="text"
              id="adminUsername"
              placeholder="Enter admin username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
            <input
              type="password"
              id="adminPassword"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoadingAdmin}
          >
            {isLoadingAdmin ? 'Logging in...' : 'Login as Admin'}
          </button>
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

export default AdminLoginPage;
