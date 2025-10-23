import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  Landmark,
  Bell,
  LogOut,
  BanknoteArrowUp,
  UserPlus,
  Eye,
  Book,
  BookOpen
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import all required components for the nested routes
import AdmissionApplication from '../components/Students/AdmissionApplication';
import PayFees from '../components/Payment/PayFees';
import StudentFee from '../components/Payment/StudentFee';
import LogoutConfirmationModal from '../components/Logout/LogoutConfirmationModal';
import PayInstallment from '../components/Payment/PayInstallment';
import StudentInstallment from '../components/Payment/StudentInstallment';
import UpdateFee from '../components/Payment/UpdateFee';
import Register from '../components/Register/Register';
import PreviewStatus from '../components/PreviewStatus/PreviewStatus';
import CourseContent from '../components/Admin/CourseContent';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Register', icon: UserPlus, path: '/student/completeRegistration' },
    { name: 'View Courses', icon: BookOpen, path: '/student/viewCourses'},
    { name: 'Admission Application', icon: Users, path: '/student/applicants' },
    { name: 'Fees Payment', icon: Landmark, path: '/student/studentFee' },
    { name: 'Preview Status', icon: Eye, path: '/student/previewStatus' }
  ];

  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen p-3" style={{ "minWidth": '270px' }}>
      <div className="flex items-center space-x-2 mb-8">
        <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">C</div>
        <span className="text-xl font-bold">Student Dashboard</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 list-unstyled">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`rounded w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-decoration-none text-white duration-200 ${
                  location.pathname === item.path || (location.pathname === '/student' && item.path === '/student')
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
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

const Header = ({ onLogoutClick, studentName }) => {
  const firstName = studentName ? studentName.split(' ')[0] : 'Student';

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center w-full sticky top-0 z-10">
      <h4 className="text-md font-semibold text-gray-800">Welcome! {firstName}</h4>
      <div className="flex items-center space-x-4">
        <Bell size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        <div className="flex items-center space-x-2 cursor-pointer me-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {studentName ? studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SN'}
          </div>
          <span className="text-gray-700">{studentName || 'Student Name'}</span>
        </div>
        <button
          title='Logout'
          onClick={onLogoutClick}
          className='bg-red-500 hover:bg-red-600 rounded px-4 py-2 flex items-center justify-center text-white'
        >
          <LogOut size={16} className='cursor-pointer me-2' />
          <span className=''>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentFullName, setStudentFullName] = useState('');
  const [role, setRole] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [nameFetchError, setNameFetchError] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');
    const studentId = sessionStorage.getItem('studentId');

    if (!token || !storedRole || !studentId) {
      navigate('/');
      return;
    }

    try {
      const parsedRoles = JSON.parse(storedRole);
      if (Array.isArray(parsedRoles) && parsedRoles.includes("ROLE_STUDENT")) {
        setRole('Student');
        fetchStudentName(studentId, token);
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error("Failed to parse roles from session storage:", e);
      navigate('/');
    }
  }, [navigate]);

  const fetchStudentName = async (studentId, token) => {
    setNameFetchError(false);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://localhost:8080/student/getName/${studentId}`, config);
      if (response.data) {
        setStudentFullName(response.data);
      } else {
        console.warn("API returned no data for student name.");
        setStudentFullName('Student Name');
      }
    } catch (error) {
      console.error("Error fetching student name:", error);
      setNameFetchError(true);
      setStudentFullName('Error Fetching Name');
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('studentId');
    sessionStorage.removeItem('username');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!role && !nameFetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-gray-700">Loading Dashboard...</h1>
      </div>
    );
  }

  if (nameFetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <h1 className="text-2xl font-bold text-red-700">Error loading student data. Please try again.</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans antialiased overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow h-screen overflow-hidden">
        <Header onLogoutClick={handleLogoutClick} studentName={studentFullName} />
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="completeRegistration" element={<Register />} />
            <Route path="applicants" element={<AdmissionApplication />} />
            <Route path="studentFee" element={<StudentFee />} />
            <Route path="previewStatus" element={<PreviewStatus />} />
            <Route path="viewCourses" element={<CourseContent />} />

            {/* 💡 CORRECTED NESTED ROUTES */}
            <Route path="getFees/:studentId" element={<StudentFee />} />
            <Route path="getInstallment/:feeId" element={<StudentInstallment />} />
            <Route path="payFees/:studentId" element={<PayFees />} />
            <Route path="payInstallment/:studentId/:installmentId" element={<PayInstallment />} />
            <Route path="updateFees/:studentId" element={<UpdateFee />} />

            <Route path="*" element={<Register />} />
          </Routes>
        </main>
      </div>

      <LogoutConfirmationModal
        isVisible={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}