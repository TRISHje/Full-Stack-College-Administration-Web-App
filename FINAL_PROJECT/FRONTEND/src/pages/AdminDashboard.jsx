/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Home,
  User,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Files,
  LayoutDashboard,
  Users,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Landmark,
  IdCard,
  HatGlasses,
  LogOut,
  Percent
} from 'lucide-react';

import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ViewFee from '../components/Payment/ViewFee'
import Students from '../components/Admin/Students';
import ApplicantsContent from '../components/Admin/ApplicantsContent';
import FeesManagement from '../components/Admin/FeesManagement';
import CourseContent from '../components/Admin/CourseContent';

// Import the reusable LogoutConfirmationModal component.
// IMPORTANT: Please verify this path carefully based on your project structure.
// Adjust this path if your LogoutConfirmationModal.jsx file is located differently.
import LogoutConfirmationModal from '../components/Logout/LogoutConfirmationModal';
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip } from 'recharts';

// Recharts colors - using a wider range for potentially more courses
const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#d946da', '#1e40af', '#059669', '#b91c1c', '#ca8a04', '#6d28d9', '#a21caf'];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-md">
        {/* For Pie Chart, payload[0].name will be the course name and payload[0].value will be the count */}
        <p className="text-sm font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-xs text-gray-500">{`(${((payload[0].percent || 0) * 100).toFixed(1)}%)`}</p>
      </div>
    );
  }
  return null;
};

// Sidebar Component (UPDATED for React Router - uses absolute paths for Links)
const Sidebar = () => {
  const location = useLocation(); // Hook to get current URL location

  // Define navItems with ABSOLUTE paths relative to the root of your app.
  // Since AdminDashboard is mounted at /admin/* in App.jsx,
  // these paths will ensure correct navigation from any nested route.
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' }, // Base path for admin dashboard
    { name: 'Students', icon: IdCard, path: '/admin/students' },
    { name: 'Admission Applications', icon: Users, path: '/admin/applicants' },
    { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
    { name: 'Fees Management', icon: Landmark, path: '/admin/feesManagement'},
  ];

  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen p-3" style={{"minWidth": '270px'}}>
      <div className="flex items-center space-x-2 mb-8">
        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">A</div>
        <span className="text-xl font-bold">Admin Dashboard</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 list-unstyled text-decoration-none">
          {navItems.map((item) => (
            <li key={item.name} className='text-decoration-none'>
              {/* Use Link component for navigation */}
              <Link
                to={item.path}
                // Check if current path matches to apply active styling
                // Use location.pathname for full comparison
                className={`rounded w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 
                  ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}
                  no-underline text-white text-decoration-none
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Header Component (UPDATED to accept onLogoutClick prop)
const Header = ({ onLogoutClick }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center w-full sticky top-0 z-10">
      <h4 className="text-md font-semibold text-gray-800">Welcome! Admin</h4>
      <div className="flex items-center space-x-4">
        <Bell size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-pointer me-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            A
          </div>
          <span className="text-gray-700">Administrator</span>
        </div>
        <button
          title='Logout'
          className='bg-red-500 hover:bg-red-600 rounded px-4 py-2 flex items-center justify-center text-white'
          onClick={onLogoutClick} // Call the logout confirmation handler
        >
          <LogOut size={16} className='cursor-pointer me-2' />
          <span className=''>Logout</span>
        </button>
      </div>
    </header>
  );
};

// Dashboard Content Component - remains mostly the same
const DashboardContent = () => {
  const [stats, setStats] = useState({total: 0, accepted: 0, pending: 0, rejected: 0});
  const [courseStats, setCourseStats] = useState(0); // Changed initial state to 0 for count
  const [studentStats, setStudentStats] = useState(0); // Changed initial state to 0 for count
  const [admissionsByCoursePieData, setAdmissionsByCoursePieData] = useState([]); // New state for course-wise pie chart
  const [mainStatusPieData, setMainStatusPieData] = useState([]); // Existing state for overall status pie chart
  const [errorMsg, setErrorMsg] = useState('');
  const token = sessionStorage.getItem('token'); 

  // Reusable function to fetch course name
  const fetchCourseName = async (courseId) => {
    const url = `http://localhost:8080/courses/getCourseName/${courseId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error(`Error fetching course name for ID ${courseId}: ${response.status}`);
        return `Error Course (${courseId})`;
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Failed to fetch course name:", error);
      return `Unknown Course (${courseId})`;
    }
  };

  const fetchStudentStats = async () => {
    const studentFetchUrl = "http://localhost:8080/student/stats";

    if(!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(studentFetchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStudentStats(data);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch student stats:", error);
      if (error.message.includes('400')) {
        setErrorMsg("Bad Request: Check student stats API endpoint.");
      } else {
        setErrorMsg("Failed to load student stats. Please try again later.");
      }
    }
  }

  const fetchCourseCount = async() => {
    const courseFetchUrl = "http://localhost:8080/courses/stats";

    if(!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(courseFetchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCourseStats(data);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch course count:", error);
      if (error.message.includes('400')) {
        setErrorMsg("Bad Request: Check course stats API endpoint.");
      } else {
        setErrorMsg("Failed to load course count. Please try again later.");
      }
    }
  }

  const fetchAdmissionStatsAndCourseBreakdown = async () => {
    const admissionsUrl = "http://localhost:8080/admissions/getAllAdmissions";
    const overallStatsUrl = "http://localhost:8080/admissions/stats";

    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const overallResponse = await fetch(overallStatsUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!overallResponse.ok) {
        throw new Error(`HTTP error! status: ${overallResponse.status} from overall stats`);
      }
      const overallData = await overallResponse.json();
      setStats(overallData);
      setMainStatusPieData([
        { name: 'Accepted', value: overallData.accepted },
        { name: 'Pending', value: overallData.pending },
        { name: 'Rejected', value: overallData.rejected },
      ]);

      const allAdmissionsResponse = await fetch(admissionsUrl, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!allAdmissionsResponse.ok) {
        throw new Error(`HTTP error! status: ${allAdmissionsResponse.status} from all admissions`);
      }
      const allAdmissions = await allAdmissionsResponse.json();

      const acceptedAdmissionsByCourseId = {}; //empty object
      allAdmissions.forEach(applicant => {
        if (applicant.status === 'ACCEPTED') {
          acceptedAdmissionsByCourseId[applicant.courseId] = (acceptedAdmissionsByCourseId[applicant.courseId] || 0) + 1;
        }
      });

      const uniqueCourseIds = Object.keys(acceptedAdmissionsByCourseId);
      const courseNamePromises = uniqueCourseIds.map(id => fetchCourseName(id));
      const fetchedCourseNames = await Promise.all(courseNamePromises);

      const courseIdToNameMap = uniqueCourseIds.reduce((acc, id, index) => {
        acc[id] = fetchedCourseNames[index];
        return acc;
      }, {});

      const newPieData = Object.entries(acceptedAdmissionsByCourseId).map(([courseId, count]) => ({
        name: courseIdToNameMap[courseId] || `Unknown Course (${courseId})`,
        value: count,
      }));

      setAdmissionsByCoursePieData(newPieData);
      setErrorMsg("");

    } catch (error) {
      console.error("Failed to fetch admissions data:", error);
      if (error.message.includes('400')) {
        setErrorMsg("Bad Request: Check API endpoints and parameters.");
      } else {
        setErrorMsg("Failed to load dashboard data. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchAdmissionStatsAndCourseBreakdown();
    fetchCourseCount();
    fetchStudentStats();
  }, []);

  const admissionRate = stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(0) : 0;

  const kpiData = [
    { title: 'Total Applications', value: stats.total, icon: Users, color: 'bg-blue-400' },
    { title: 'Accepted Applications', value: stats.accepted, icon: CheckCircle, color: 'bg-green-400' },
    { title: 'Pending Applications', value: stats.pending, icon: Clock, color: 'bg-yellow-400' },
    { title: 'Rejected Applications', value: stats.rejected, icon: ExternalLink, color: 'bg-red-400' },
    { title: 'Admission Rate', value: `${admissionRate}%`, icon: Percent, color: 'bg-purple-400' },
  ];

  const otherData = [
    {title: 'Total Courses', value: courseStats, icon: BookOpen, color: 'bg-blue-400'},
    {title: 'Total Students', value: studentStats, icon: User, color: 'bg-green-400'},
    {title: 'Total Admins', value: '1', icon: HatGlasses, color: 'bg-gray-900'},
  ];

  return (
    <div className="flex-grow p-6 bg-gray-100">
      {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}
      {/* KPI Cards */}
      <h4 className="text-2xl font-bold mb-3">Admission Applications</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 border-b border-gray-300 pb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`relative p-6 rounded-xl shadow-md text-white ${kpi.color}`}>
            <div className="absolute top-4 right-4 text-white opacity-40">
              <kpi.icon size={36} />
            </div>
            <p className="text-sm font-medium">{kpi.title}</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{kpi.value !== undefined && kpi.value !== null ? kpi.value : 'N/A'}</h2>
          </div>
        ))}
      </div>

      <h4 className="text-2xl font-bold mb-3">Other Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 border-b border-gray-300 pb-6">
        {otherData.map((o, index) => (
          <div key={index} className={`relative p-6 rounded-xl shadow-md text-white ${o.color}`}>
            <div className="absolute top-4 right-4 text-white opacity-40">
              <o.icon size={36} />
            </div>
            <p className="text-sm font-medium">{o.title}</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{o.value !== undefined && o.value !== null ? o.value : 'N/A'}</h2>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEW: Admissions by Course Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="font-semibold mb-4">Admissions by Course</h4>
          <ResponsiveContainer width="100%" height={300}>
            {admissionsByCoursePieData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={admissionsByCoursePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {admissionsByCoursePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Loading course admissions data...
                    </div>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Existing: Overall Applicant Status Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold mb-4">Overall Applicant Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  {mainStatusPieData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={mainStatusPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {mainStatusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Loading overall status data...
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      };

// AdminDashboard Component - Main container for the dashboard
export default function AdminDashboard() {
  const navigate = useNavigate();
  // State for username and role (optional, for display if retrieved from session/token)
  const [username, setUsername] = useState('Administrator');
  const [role, setRole] = useState('Admin');
  // State for modal visibility
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Simple authentication check (adjust as per your actual auth flow)
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');

    if (!token || !storedRole) {
      navigate('/'); // Redirect to admin login if no token/role
      return;
    }

    try {
      const parsedRoles = JSON.parse(storedRole);
      if (!Array.isArray(parsedRoles) || !parsedRoles.includes("ROLE_ADMIN")) {
        navigate('/'); // Not authorized as admin, redirect
      }
      // If token and role are present and valid, optionally set username/role for display
      // For a real app, you'd decode the token to get actual user data.
    } catch (e) {
      console.error("Failed to parse roles from session storage:", e);
      navigate('/'); // Redirect if roles are malformed
    }
  }, [navigate]);


  // Function to show the logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Function to perform actual logout
  const confirmLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/'); // Redirect to admin login page after logout
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Show loading while authenticating
  if (!username) { // Assuming username would be set after auth check
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-gray-700">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans antialiased overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow h-screen overflow-hidden">
        {/* Pass the handleLogoutClick function to the Header */}
        <Header onLogoutClick={handleLogoutClick} />
        <main className="flex-grow overflow-y-auto">
          {/* Define your routes within <Routes> (nested routes) */}
          <Routes>
            {/* The 'index' route matches the parent path, e.g., /admin */}
            <Route index element={<DashboardContent />} />
            {/* These paths are relative to the parent path /admin/.
                E.g., path="students" resolves to /admin/students */}
            <Route path="students" element={<Students />} />
            <Route path="applicants" element={<ApplicantsContent />} />
            <Route path="courses" element={<CourseContent />} />
            <Route path="feesManagement" element={<FeesManagement />} />
            <Route path ="viewFee/:studentId" element ={<ViewFee />} />
            {/* Fallback route for any unmatched sub-paths within /admin/* */}
            <Route path="*" element={<DashboardContent />} />
          </Routes>
        </main>
      </div>

      {/* Render the LogoutConfirmationModal */}
      <LogoutConfirmationModal
        isVisible={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
