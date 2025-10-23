/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
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
  Button, // Import Button component
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from "react-router-dom";
// NEW IMPORTS FOR EXCEL DOWNLOAD
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

export default function FeesManagement() {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(''); // Initialize searchTerm to an empty string
  const [studentNames, setStudentNames] = useState({}); // New state to store student names
  const token = sessionStorage.getItem('token'); 

  // Helper function to fetch student name by ID
  const fetchStudentName = async (studentId) => {
    const url = `http://localhost:8080/student/getName/${studentId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error(`Error fetching student name for ID ${studentId}: ${response.status}`);
        return "N/A"; // Return a fallback if there's an error
      }
      const data = await response.text(); // Assuming the API returns plain text name
      return data;
    } catch (error) {
      console.error(`Failed to fetch student name for ID ${studentId}:`, error);
      return "N/A"; // Fallback for network or other errors
    }
  };

  // Data fetching logic using useEffect
  useEffect(() => {
    const fetchAllFeesAndStudentNames = async () => {
      try {
        const feesResponse = await fetch('http://localhost:8080/fee/getAllFees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!feesResponse.ok) {
          throw new Error(`HTTP error! status: ${feesResponse.status}`);
        }
        const feesData = await feesResponse.json();
        setFeesData(feesData);

        // Extract unique student IDs from the fetched fees data
        const uniqueStudentIds = [...new Set(feesData.map(fee => fee.studentId))];

        // Create an array of promises for fetching student names concurrently
        const studentNamePromises = uniqueStudentIds.map(id => fetchStudentName(id));
        const fetchedStudentNamesArray = await Promise.all(studentNamePromises);

        // Map student IDs to their fetched names
        const newStudentNames = uniqueStudentIds.reduce((acc, id, index) => {
          acc[id] = fetchedStudentNamesArray[index];
          return acc;
        }, {});
        setStudentNames(newStudentNames);

      } catch (e) {
        console.error("Error fetching fees or student names:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeesAndStudentNames();
  }, []); // Empty dependency array means this runs once on mount

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFees = feesData.filter(fee =>
    // Assuming you want to search by student ID, name, or status
    fee.studentId?.toString().includes(searchTerm.toLowerCase()) ||
    studentNames[fee.studentId]?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by fetched student name
    fee.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the correct number of columns based on your TableHead
  const numberOfColumns = 7; // Student ID, Student Name, Total Amount, Concession, Amount Paid, Remaining Amount, Status

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredFees.length - page * rowsPerPage);

  // === NEW: handleDownloadExcel function ===
  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const dataToExport = filteredFees.map(fee => {
      const remaining_amount = fee.total_amount - (fee.amount_paid || 0);

      return {
        'Student ID': fee.studentId,
        'Student Name': studentNames[fee.studentId] || 'N/A',
        'Total Amount': fee.total_amount,
        'Concession (%)': fee.concession_perc || 0,
        'Amount Paid': (fee.amount_paid || 0).toFixed(2),
        'Remaining Amount': remaining_amount.toFixed(2),
        'Status': remaining_amount <= 0 ? "PAID" : "PENDING",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fees Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'fees_report.xlsx');
  };

  // Render loading and error states
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-2xl font-bold text-gray-800">Fees Management</h5>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by student ID, name, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-1 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 me-3"
          />
          {/* === NEW: Download Excel Button === */}
          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadExcel}
            className="bg-green-400 hover:bg-green-600 text-white rounded-md px-4 py-2 shadow-md text-capitalize"
          >
            Download Excel
          </Button>
        </div>
      </div>
      <TableContainer component={Paper} className="rounded-lg shadow-md mt-2">
        <Table sx={{ minWidth: 650 }} aria-label="fees table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Student ID</TableCell>
              <TableCell align="center">Student Name</TableCell>
              <TableCell align="center">Total Amount</TableCell>
              <TableCell align="center">Concession (%)</TableCell>
              <TableCell align="center">Amount after Concession</TableCell>
              <TableCell align="center">Amount Paid</TableCell>
              <TableCell align="center">Remaining Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredFees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredFees
            ).map((fee) => {
              // Calculate amount after concession and remaining amount

              return (
                <TableRow key={fee.feeId}>
                  <TableCell align="center">{fee.studentId}</TableCell>
                  <TableCell>{studentNames[fee.studentId] || 'Loading...'}</TableCell>
                  <TableCell align="center">₹{fee.total_amount}</TableCell>
                  <TableCell align="center">{fee.concession_perc || 0}%</TableCell>
                  <TableCell align="center">₹{fee.total_amount - fee.total_amount * fee.concession_perc / 100}</TableCell>
                  <TableCell align="center">₹{(fee.amount_paid || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">₹{fee.remaining_amount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fee.remaining_amount.toFixed(2) <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {fee.remaining_amount.toFixed(2) <= 0 ? "PAID" : "PENDING"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                                    <Link
                                      className="btn btn-outline-primary btn-sm"
                                      to={`/admin/viewFee/${fee.studentId}`}
                                    >
                                      View
                                    </Link>
                                  </TableCell>
                </TableRow>
              );
            })}
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
                count={filteredFees.length}
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
