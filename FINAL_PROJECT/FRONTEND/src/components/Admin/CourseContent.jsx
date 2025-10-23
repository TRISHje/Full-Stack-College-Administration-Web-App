/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

import {
  MoreVert as MoreVertIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  TableHead,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// NEW IMPORTS FOR EXCEL DOWNLOAD
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// Component for the pagination actions (First, Previous, Next, Last page buttons)
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
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
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

// Initial state for a new course form
const initialCourseState = {
  courseName: '',
  courseCode: '',
  description: '',
  duration: '',
  totalSeats: '',
  isActive: true,
  baseFee: '', // Reverting this to an empty string as it's better for user input
  taxRate: '18',
};

// Main CourseContent component
export default function CourseContent() {
  const [courses, setCourses] = useState([]);
  const [successMsg, setSuccessMsg] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState(initialCourseState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const token = sessionStorage.getItem('token');
  const roleString = sessionStorage.getItem('role');
  let role = null; // Initialize role as null

  try {
    // Attempt to parse the stored role string
    const parsedRole = JSON.parse(roleString);
    // Check if the parsed result is an array and has items
    if (Array.isArray(parsedRole) && parsedRole.length > 0) {
      // Assuming the role is the first item in the array
      role = parsedRole[0];
    }
  } catch (e) {
    // If parsing fails, it might be a simple string (less likely)
    console.error("Failed to parse role from sessionStorage, treating as simple string.", e);
    role = roleString;
  }
  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetches all courses and their corresponding fees
  const fetchCourses = async () => {
    const coursesUrl = "http://localhost:8080/courses/getAllCourses";

    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(coursesUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const courseData = await response.json();

      const feePromises = courseData.map(course =>
        fetch(`http://localhost:8080/courseFees/getCourseFeesByCourseCode/${course.courseCode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.ok ? res.json() : {})
          .catch(error => {
            console.error(`Failed to fetch fees for course ${course.courseCode}:`, error);
            return {};
          })
      );

      const feeData = await Promise.all(feePromises);
      const combinedData = courseData.map((course, index) => ({
        ...course,
        ...feeData[index],
      }));

      setCourses(combinedData);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setErrorMsg("Failed to load courses. Please try again later.");
    }
  };

  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to toggle the dropdown menu visibility
  const toggleDropdown = (courseId) => {
    setActiveDropdownId(activeDropdownId === courseId ? null : courseId);
  };

  // Handle opening the form for a new course
  const handleOpenAddForm = () => {
    setFormData(initialCourseState);
    setIsEditMode(false);
    setIsFormVisible(true);
  };

  // Handle opening the form to update an existing course
  const handleUpdateClick = (course) => {
    setFormData(course);
    setIsEditMode(true);
    setIsFormVisible(true);
    setActiveDropdownId(null);
  };

  // Handle deleting a course
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setIsDeleteConfirmVisible(true);
    setActiveDropdownId(null);
  };
   
  // Confirms the delete action and performs the API call
  const confirmDelete = async () => {
    if (!courseToDelete) return;
     
    // API endpoint for deleting the course fees
    const deleteFeesUrl = `http://localhost:8080/courseFees/deleteCourseFeesByCourseCode/${courseToDelete.courseCode}`;
    // API endpoint for deleting the main course
    const deleteCourseUrl = `http://localhost:8080/courses/deleteCourse/${courseToDelete.courseId}`;

    try {
      // First, delete the course fees
      const feesResponse = await fetch(deleteFeesUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!feesResponse.ok && feesResponse.status !== 404) {
        throw new Error(`Failed to delete course fees: ${feesResponse.statusText}`);
      }

      // If fees deletion is successful (or not found, hence the 404 check), proceed to delete the main course
      const courseResponse = await fetch(deleteCourseUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!courseResponse.ok) {
        throw new Error(`Failed to delete course: ${courseResponse.statusText}`);
      }

      setErrorMsg("Course and associated fees deleted successfully!");
      alert("Course Deleted Successfully.");
      fetchCourses(); // Re-fetch the courses to update the table
      setIsDeleteConfirmVisible(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Failed to delete course:", error);
      setErrorMsg(`Failed to delete course: ${error.message}`);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission (Add or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
     
    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      if (isEditMode) {
        // Handle UPDATE logic
        // First, update the main course details
        const courseUpdateUrl = `http://localhost:8080/courses/updateCourse/${formData.courseId}`;
        console.log("Attempting to PUT to URL:", courseUpdateUrl);
        const courseUpdatePayload = {
          courseId: formData.courseId,
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          description: formData.description,
          duration: formData.duration,
          totalSeats: formData.totalSeats,
          isActive: formData.isActive,
          createdAt: new Date().toISOString(), // Ensure createdAt is set to the current time
        };

        const courseUpdateResponse = await fetch(courseUpdateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(courseUpdatePayload)
        });

        if (!courseUpdateResponse.ok) {
          throw new Error(`Failed to update course details: ${courseUpdateResponse.statusText}`);
        }

        // Then, update the course fees
        const feesUpdateUrl = `http://localhost:8080/courseFees/updateCourseFeesByCourseCode/${formData.courseCode}`;
        const feesUpdatePayload = {
          courseId: formData.courseId,
          baseFee: parseFloat(formData.baseFee),
          taxRate: parseFloat(formData.taxRate),
        };

        const feesUpdateResponse = await fetch(feesUpdateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(feesUpdatePayload)
        });
         
        if (!feesUpdateResponse.ok) {
          throw new Error(`Failed to update course fees: ${feesUpdateResponse.statusText}`);
        }

        setErrorMsg("Course updated successfully!");
        alert("Course Updated Successfully.");
      } else {
        // Handle ADD logic
        const courseUrl = "http://localhost:8080/courses/addCourse";
        const courseFeesUrl = "http://localhost:8080/courseFees/addCourseFees";

        const coursePayload = {
          courseName: formData.courseName,
          courseCode: formData.courseCode,
          description: formData.description,
          duration: formData.duration,
          totalSeats: formData.totalSeats,
          isActive: formData.isActive,
        };

        const courseResponse = await fetch(courseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(coursePayload)
        });
         
        if (!courseResponse.ok) {
          const errorData = await courseResponse.json();
          throw new Error(`HTTP error! Status: ${courseResponse.status}. Message: ${errorData.message}`);
        }
         
        const courseFeesPayload = {
          courseCode: formData.courseCode,
          baseFee: formData.baseFee,
          taxRate: formData.taxRate,
        };
   
        const feesResponse = await fetch(courseFeesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(courseFeesPayload)
        });
   
        if (!feesResponse.ok) {
          const errorData = await feesResponse.json();
          throw new Error(`HTTP error! Status: ${feesResponse.status}. Message: ${errorData.message}`);
        }
        setErrorMsg("Course and fees added successfully!");
        alert("Course and fees added successfully!");
      }

      setFormData(initialCourseState);
      setIsFormVisible(false);
      fetchCourses();
       
    } catch (error) {
      console.error("Form submission failed:", error);
      setErrorMsg(`Failed to save course: ${error.message}`);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.duration.toString().includes(searchTerm) ||
    course.totalSeats.toString().includes(searchTerm)
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

  // Function to calculate the full fee
  const calculateFullFee = (baseFee, taxRate) => {
    const totalFee = (parseFloat(baseFee) || 0) + ((parseFloat(baseFee) || 0) * (parseFloat(taxRate) || 0) / 100);
    return totalFee.toFixed(2);
  };
  
  // NEW FUNCTION TO HANDLE EXCEL DOWNLOAD
  const handleDownload = () => {
    // Prepare the data for the Excel sheet
    const dataToExport = filteredCourses.map(course => ({
      'Course Code': course.courseCode,
      'Course Name': course.courseName,
      'Description': course.description,
      'Duration': course.isActive === "true" ? course.duration : "N/A",
      'Total Seats': course.isActive === "true" ? course.totalSeats : "N/A",
      'Is Active': course.isActive === "true" ? "Yes" : "No",
      'Base Fee (₹)': course.baseFee,
      'Tax Rate (%)': course.taxRate,
      'Full Fee (₹)': calculateFullFee(course.baseFee, course.taxRate),
    }));

    // Create a new worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

    // Generate the Excel file as a binary string
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Convert the binary string to a Blob and save it
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'Courses.xlsx');
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-2xl font-bold text-gray-800">Courses Available</h5>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-1 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* NEW EXCEL DOWNLOAD BUTTON */}
        </div>
          {role == "ROLE_ADMIN" && <div className="flex">
            <button
            className="bg-green-600 text-white font-semibold py-2 px-4 me-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
            onClick={handleDownload}
          >
            Download Excel
          </button>
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            onClick={handleOpenAddForm}
          >
            <AddIcon className="me-2" /> Add New Course
          </button>
          </div>}
      </div>

      {errorMsg && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{errorMsg}</div>}
       
      {/* Modal for Add/Update Course Form */}
      {isFormVisible && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setIsFormVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
      >&times;</button>
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Update Course' : 'Add New Course'}</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseName">Course Name</label>
            <input
              type="text"
              name="courseName"
              id="courseName"
              value={formData.courseName}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courseCode">Course Code</label>
            <input
              type="text"
              name="courseCode"
              id="courseCode"
              value={formData.courseCode}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              disabled={isEditMode} // Disable editing the course code during an update
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration (e.g., "120 Hours")</label>
            <input
              type="text"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalSeats">Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              id="totalSeats"
              value={formData.totalSeats}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baseFee">Base Fee</label>
            <input
              type="number"
              name="baseFee"
              id="baseFee"
              value={formData.baseFee}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxRate">Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              id="taxRate"
              value={formData.taxRate}
              onChange={handleFormChange}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleFormChange}
              className="mr-2 leading-tight"
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="isActive">Is Active</label>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-blue-700"
          >
            {isEditMode ? 'Update Course' : 'Add Course'}
          </button>
          <button
            type="button"
            onClick={() => setIsFormVisible(false)}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteConfirmVisible(false)}
                className="bg-gray-500 text-white font-bold py-2 px-4 me-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <TableContainer component={Paper} className="rounded-lg shadow-md mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="courses table">
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Duration (Hours)</TableCell>
              <TableCell align="right">Seats</TableCell>
              <TableCell align="right">Full Fees</TableCell>
              <TableCell align="center">Is Active</TableCell>
              {role == "ROLE_ADMIN" && <TableCell align="center">Options</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredCourses
            ).map((course) => (
              <TableRow key={course.courseId}>
                <TableCell>{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell align="right">{course.isActive === "true" ? course.duration : "N/A"}</TableCell>
                <TableCell align="right">{course.isActive === "true" ? course.totalSeats : "N/A"}</TableCell>
                <TableCell align="right">₹{course.isActive === "true" ? `${calculateFullFee(course.baseFee, course.taxRate)}` : "N/A"}</TableCell>
                <TableCell align="center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.isActive === "true" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.isActive === "true" ? "Yes" : "No"}
                  </span>
                </TableCell>
                {role == "ROLE_ADMIN" && <TableCell align="center">
                  <div className="relative">
                    <IconButton
                      aria-label="more"
                      aria-controls={`options-menu-${course.courseId}`}
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(course.courseId)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {activeDropdownId === course.courseId && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => handleUpdateClick(course)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <EditIcon className="mr-2" style={{ fontSize: '1.2rem' }}/> Update
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <DeleteIcon className="mr-2" style={{ fontSize: '1.2rem' }}/> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={8}
                count={filteredCourses.length}
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
    </div>
  );
}