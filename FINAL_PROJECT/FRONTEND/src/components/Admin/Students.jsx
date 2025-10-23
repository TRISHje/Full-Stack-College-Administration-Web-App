/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import {
  MoreVert as MoreVertIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Close as CloseIcon
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
  Modal,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

// NEW IMPORTS FOR EXCEL DOWNLOAD
// If you encounter an error like "Could not resolve 'xlsx'", please ensure you have installed these packages:
// npm install xlsx file-saver
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

const getCourseAbbreviation = (name) => {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const words = name.split(' ');
    const abbreviation = words.map(word => word.charAt(0).toUpperCase()).join('');
    return abbreviation.slice(0, abbreviation.length);
  };
// Student Details Modal Component
const StudentDetailsModal = ({ open, handleClose, student, courseName }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="student-details-modal-title"
      aria-describedby="student-details-modal-description"
      className="flex items-center justify-center"
    >
      <Box className="bg-white pt-6 px-6 rounded-lg shadow-xl relative w-11/12 max-w-lg">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="absolute top-2 right-2"
        >
          <CloseIcon />
        </IconButton>
        {student && (
          <div id="student-details-modal-description" className="space-y-3">
            <Avatar
              alt={student.name}
              src={`https://placehold.co/90x90/87CEEB/000000?text=${getCourseAbbreviation(student.name)}`}
              sx={{ width: 90, height: 90 }}
              align="center"
              className="mx-auto mb-3"
            />
            <p className='text-center h5 mb-4'><strong>{student.name}</strong></p>
            <table className="table table-hover">
              <tbody>
                <tr>
                <th>Username:</th>
                <td>{student.username}</td>
              </tr>
              <tr>
                <th>Course:</th>
                <td>{courseName || "Loading..."}</td>
              </tr>
              <tr>
                <th>Date of Birth:</th>
                <td>{formatDate(student.dob)}</td>
              </tr>
              <tr>
                <th>Gender:</th>
                <td>{student.gender}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>{student.email}</td>
              </tr>
              <tr>
                <th>Phone No.:</th>
                <td>{student.phoneNo}</td>
              </tr>
              <tr>
                <th>Address:</th>
                <td>{student.address}</td>
              </tr>
              <tr>
                <th>City:</th>
                <td>{student.city}</td>
              </tr>
              <tr>
                <th>State:</th>
                <td>{student.state}</td>
              </tr>
              </tbody>
            </table>
            <p className='text-center text-gray-500 text-sm mt-4'>&copy;&nbsp;CAMS</p>
          </div>
        )}
      </Box>
    </Modal>
  );
};

// Main Students component
export default function Students() {
  const [students, setStudents] = useState([]);
  const [courseNames, setCourseNames] = useState({});
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  // State to manage the student details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const token = sessionStorage.getItem('token'); 

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchCourseName = async (courseId) => {
    const url = `http://localhost:8080/courses/getCourseName/${courseId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return `Error: ${response.status}`;
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Failed to fetch course name:", error);
      return "Unknown Course";
    }
  };

  const fetchStudents = async () => {
    const url = "http://localhost:8080/student/getAllStudents";

    if (!token) {
      setErrorMsg("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
      setErrorMsg("");

      const uniqueCourseIds = [...new Set(data.map(student => student.courseId))];
      const courseNamePromises = uniqueCourseIds.map(id => fetchCourseName(id));
      const fetchedCourseNames = await Promise.all(courseNamePromises);

      const newCourseNames = uniqueCourseIds.reduce((acc, id, index) => {
        acc[id] = fetchedCourseNames[index];
        return acc;
      }, {});

      setCourseNames(newCourseNames);
    } catch (error) {
      setErrorMsg("Failed to fetch students. Please try again later.");
    }
  };

  const toggleDropdown = (studentId) => {
    setActiveDropdownId(activeDropdownId === studentId ? null : studentId);
  };

  // Updated viewDetails function to open the modal
  const viewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setActiveDropdownId(null); // Close the dropdown menu
  };

  const handleDelete = (studentId) => {
    console.log(`Delete action for student ID: ${studentId}`);
    setActiveDropdownId(null);
  };

  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
    || student.gender.toLowerCase().includes(searchTerm.toLowerCase())
    || student.state.toLowerCase().includes(searchTerm.toLowerCase())
    || student.email.toLowerCase().includes(searchTerm.toLowerCase())
    || student.phoneNo.toString().includes(searchTerm)
    || courseNames[student.courseId]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length) : 0;

  // NEW FUNCTION TO HANDLE EXCEL DOWNLOAD
  const handleDownload = () => {
    // Prepare the data for the Excel sheet
    const dataToExport = filteredStudents.map(student => ({
      'Student ID': student.studentId,
      'Username': student.username,
      'Name': student.name,
      'Course': courseNames[student.courseId] || "Unknown Course",
      'Date of Birth': formatDate(student.dob),
      'Gender': student.gender,
      'Email': student.email,
      'Phone No.': student.phoneNo,
      'Address': student.address,
      'City': student.city,
      'State': student.state,
    }));

    // Create a new worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Generate the Excel file as a binary string
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert the binary string to a Blob and save it
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'Students.xlsx');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-2xl font-bold text-gray-800">Students Registered</h5>
        <div className="flex items-center space-x-4"> {/* Added a div for layout */}
          <input
            type="text"
            placeholder="Search by..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-1 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 me-3"
          />
          {/* NEW EXCEL DOWNLOAD BUTTON */}
          <button
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 whitespace-nowrap"
            onClick={handleDownload}
          >
            Download Excel
          </button>
        </div>
      </div>

      {errorMsg && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{errorMsg}</div>}

      <TableContainer component={Paper} className="rounded-lg shadow-md overflow-auto">
        <Table sx={{ minWidth: 650 }} aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell className="px-6 py-3 text-center">ID</TableCell>
              <TableCell className="px-6 py-3 text-center">Name</TableCell>
              <TableCell className="px-6 py-3 text-center">Course</TableCell>
              <TableCell className="px-6 py-3 text-center">DOB</TableCell>
              <TableCell className="px-6 py-3 text-center">Gender</TableCell>
              <TableCell className="px-6 py-3 text-center">Phone No.</TableCell>
              <TableCell className="px-6 py-3 text-center">Place</TableCell>
              <TableCell className="px-6 py-3 text-center">Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredStudents
            ).map((student) => (
              <TableRow key={student.studentId} title={student.name}>
                <TableCell className='px-6 py-3 text-center'>{student.studentId}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{student.name}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{courseNames[student.courseId] || "Loading..."}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{formatDate(student.dob)}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{student.gender}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{student.phoneNo}</TableCell>
                <TableCell className='px-6 py-3 text-center'>{student.state}</TableCell>
                <TableCell className='px-6 py-3 text-center'>
                  <div className="relative">
                    <IconButton
                      aria-label="more"
                      aria-controls={`options-menu-${student.studentId}`}
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(student.studentId)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {activeDropdownId === student.studentId && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => viewDetails(student)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(student.studentId)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={9} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={9}
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <StudentDetailsModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        courseName={selectedStudent ? courseNames[selectedStudent.courseId] : null}
      />
    </div>
  );
}
