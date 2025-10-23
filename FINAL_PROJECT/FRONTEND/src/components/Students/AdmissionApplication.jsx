/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

// This is a custom pagination component from the original code
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function AdmissionApplication() {
  // State for form fields
  const [academicYear, setAcademicYear] = useState('');
  const [admissionType, setAdmissionType] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(''); // Stores the courseId
  const [selectedStudentId] = useState(sessionStorage.getItem('studentId'));
  const [studentUsername] = useState(sessionStorage.getItem('username'));

  // State for course data fetched from API
  const [courses, setCourses] = useState([]); // This will now hold just the one course
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState('');

  // State for form submission feedback
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false); // To indicate if the submission message is an error

  // State for student's admissions table
  const [studentAdmissions, setStudentAdmissions] = useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(true);
  const [admissionsError, setAdmissionsError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // New state to control form visibility based on existing ACCEPTED admissions
  const [canApplyForAdmission, setCanApplyForAdmission] = useState(true);


  const navigate = useNavigate();

  // Function to generate academic years (current and future only)
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
      const startYear = currentYear + i;
      years.push(`${startYear}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears();
  const admissionTypes = ['Regular', 'External', 'Lateral'];

  // Effect to fetch the student's course from their preview data and then set the courses state
  useEffect(() => {
    const fetchCoursesAndStudentData = async () => {
      setLoadingCourses(true);
      setCourseError('');
      const token = sessionStorage.getItem('token');
      const username = sessionStorage.getItem('username');

      if (!token || !username) {
        setCourseError('Authentication or student username not found. Please log in.');
        setLoadingCourses(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Step 1: Fetch all courses
        const coursesResponse = await axios.get('http://localhost:8080/courses/getAllCourses', config);
        const allCourses = coursesResponse.data;

        if (!Array.isArray(allCourses)) {
          setCourseError('Invalid course data format received from the server.');
          setLoadingCourses(false);
          return;
        }

        // Step 2: Fetch student preview data to find the registered courseName
        const studentResponse = await axios.get(`http://localhost:8080/student/preview/${username}`, config);
        const studentCourseName = studentResponse.data?.courseName; // Corrected to use courseName from the preview API

        if (studentCourseName) {
          // Step 3: Find the matching course from the list of all courses by courseName
          const studentCourse = allCourses.find(c => c.courseName === studentCourseName); // Find by courseName
          if (studentCourse) {
            setCourses([studentCourse]); // Set the courses state to an array containing only the student's course
            setSelectedCourseId(studentCourse.courseCode); // Automatically select this course
          } else {
            setCourseError('Registered course not found in the list of available courses.');
          }
        } else {
          setCourseError('No course data found in your student profile. Please complete your registration.'); // Improved message
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setCourseError(`Failed to load course information: Complete your registration first.`);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCoursesAndStudentData();
  }, [studentUsername]); // Depend on studentUsername to refetch if it changes

  // Effect to fetch student's admissions and determine if form should be shown
  useEffect(() => {
    const fetchStudentAdmissions = async () => {
      setLoadingAdmissions(true);
      setAdmissionsError('');
      const token = sessionStorage.getItem('token');
      const studentId = sessionStorage.getItem('studentId');

      if (!token || !studentId) {
        setAdmissionsError('Authentication or student ID not found. Please log in.');
        setLoadingAdmissions(false);
        setCanApplyForAdmission(false); // Can't apply if not authenticated
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`http://localhost:8080/admissions/getAdmissions/${studentId}`, config);
        if (response.data && Array.isArray(response.data)) {
          setStudentAdmissions(response.data);

          // Check if any existing admission is 'ACCEPTED'
          const hasExistingAcceptedAdmission = response.data.some(
            (admission) => admission.status === 'ACCEPTED'
          );
          setCanApplyForAdmission(!hasExistingAcceptedAdmission); // Hide form if any accepted admission exists
        } else {
          setAdmissionsError('No admission data received or invalid format.');
          setCanApplyForAdmission(true); // Allow application if no data or invalid data, assuming no accepted admissions
        }
      } catch (error) {
        console.error('Error fetching student admissions:', error);
        setAdmissionsError(`Failed to load admissions: ${error.response?.data?.message || error.message}. Please try again.`);
        setCanApplyForAdmission(true); // Allow application in case of an error loading admissions (better safe than sorry)
      } finally {
        setLoadingAdmissions(false);
      }
    };

    fetchStudentAdmissions();
  }, [submitMessage]); // Refresh when an application is submitted

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError(false);

    const token = sessionStorage.getItem('token');
    const studentId = sessionStorage.getItem('studentId');

    if (!token) {
      setSubmitMessage('Authentication token not found. Please log in.');
      setSubmitError(true);
      setIsSubmitting(false);
      return;
    }

    if (!studentId) {
      setSubmitMessage('Student ID not found in session. Please log in again.');
      setSubmitError(true);
      setIsSubmitting(false);
      return;
    }

    if (!academicYear || !admissionType || !selectedCourseId) {
      setSubmitMessage('Please select an Academic Year, Admission Type, and Course.');
      setSubmitError(true);
      setIsSubmitting(false);
      return;
    }

    // Existing check: Fetch existing admissions and check for an 'ACCEPTED' status in the same academic year
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`http://localhost:8080/admissions/getAdmissions/${studentId}`, config);
      const existingAdmissions = response.data;

      const hasAcceptedAdmissionForSelectedYear = existingAdmissions.some(
        (admission) =>
          admission.academicYear === parseInt(academicYear) && admission.status === 'ACCEPTED'
      );

      if (hasAcceptedAdmissionForSelectedYear) {
        setSubmitMessage('You already have an accepted admission for this academic year. Cannot apply again.');
        setSubmitError(true);
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.error('Error checking existing admissions:', error);
      // Continue with submission even if this check fails, as it might be a temporary network issue.
      // You could choose to show an error and stop here if you want to be stricter.
    }


    const academicYearInt = parseInt(academicYear);
    const now = new Date().toISOString();

    const payload = {
      academicYear: academicYearInt,
      admissionType: admissionType,
      applicationDate: now,
      courseCode: selectedCourseId,
      concessionPercentage: 0,
      status: 'PENDING',
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.post(`http://localhost:8080/admissions/addAdmission/${studentId}`, payload, config);

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Admission application submitted successfully! 🎉');
        setSubmitError(false);
        setAcademicYear('');
        setAdmissionType('');
        // Refetch admissions to update the table - handled by submitMessage dependency
      } else {
        setSubmitMessage(`Failed to submit application: ${response.data?.message || 'Unknown server response.'}`);
        setSubmitError(true);
      }
    } catch (error) {
      let errorMessage = 'Error submitting application. Please try again.';
      if (error.response) {
        errorMessage = `Error: ${error.response.data?.message || 'Unknown server response.'}`;
      } else if (error.request) {
        errorMessage = "Network error: No response from server. Please check your connection.";
      }
      setSubmitMessage(errorMessage);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Find the full course name for the table (still needed for displaying the table correctly)
  const getCourseName = (courseCode) => {
    const course = courses.find(c => c.courseCode === courseCode);
    return course ? course.courseName : 'N/A';
  };
  
  const numberOfColumns = 6;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, studentAdmissions.length - page * rowsPerPage);

  return (
    <div className='container p-4 mx-auto'>
      <h5 className="text-3xl font-bold text-gray-900 mb-6 text-center">Apply for Admission</h5>
      
      {/* Admission Form Card - Conditionally rendered */}
      {canApplyForAdmission ? (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-auto border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year} - {Number(year) + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admissionType" className="block text-sm font-medium text-gray-700 mb-1">
                Admission Type <span className="text-red-500">*</span>
              </label>
              <select
                id="admissionType"
                value={admissionType}
                onChange={(e) => setAdmissionType(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Admission Type</option>
                {admissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              {loadingCourses ? (
                <p className="text-gray-500">Loading your course...</p>
              ) : courseError ? (
                <p className="text-red-600">{courseError}</p>
              ) : (
                <select
                  id="course"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {courses.length === 0 ? (
                    <option value="">No course available</option>
                  ) : (
                    // Only display the one course in the dropdown
                    courses.map((course) => (
                      <option key={course.courseId} value={course.courseCode}>
                        {course.courseName}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={isSubmitting || loadingCourses || !academicYear || !admissionType || !selectedCourseId}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            {submitMessage && (
              <p className={`mt-4 p-3 rounded-md text-center text-sm ${submitError ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      ) : (
        <p className="text-center text-green-600 font-semibold text-lg mb-8">
          You already have an ACCEPTED admission. You cannot apply for a new admission.
        </p>
      )}
      
      {/* Student Admissions Table */}
      <div className="mt-12">
        <h5 className="text-2xl font-bold text-gray-900 mb-4 text-center">Your Admission Applications</h5>
        {loadingAdmissions ? (
          <p className="text-center text-gray-500">Loading your applications...</p>
        ) : admissionsError ? (
          <p className="text-center text-red-600">{admissionsError}</p>
        ) : studentAdmissions.length === 0 ? (
          <p className="text-center text-gray-500">You have no submitted applications.</p>
        ) : (
          <TableContainer component={Paper} className="rounded-lg shadow-md max-w-4xl mx-auto">
            <Table sx={{ minWidth: 650 }} aria-label="student admissions table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Application ID</TableCell>
                  <TableCell align="center">Academic Year</TableCell>
                  <TableCell align="center">Admission Type</TableCell>
                  <TableCell align="center">Application Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Remarks</TableCell>
                  <TableCell align="center">USN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? studentAdmissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : studentAdmissions
                ).map((admission) => (
                  <TableRow key={admission.admissionId}>
                    <TableCell align="center">{admission.admissionId}</TableCell>
                    <TableCell align="center">{admission.academicYear} - {admission.academicYear+1}</TableCell>
                    <TableCell align="center">{admission.admissionType}</TableCell>
                    <TableCell align="center">{new Date(admission.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admission.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : admission.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {admission.status}
                      </span>
                    </TableCell>
                    <TableCell align="center">{admission.remarks || " "}</TableCell>
                    <TableCell align="center">{admission.usn || " "}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={numberOfColumns} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={numberOfColumns}
                    count={studentAdmissions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
