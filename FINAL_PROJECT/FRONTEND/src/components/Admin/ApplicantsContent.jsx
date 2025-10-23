/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  MoreVert as MoreVertIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Close as CloseIcon,
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
  Typography,
  Chip,
  Button,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Component for the pagination actions
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

// Applicant Details Modal Component
const ApplicantDetailsModal = ({ open, handleClose, applicant, applicantFees, courseName, documents, onAccept, onReject }) => {
  const [remarks, setRemarks] = useState('');
  const [usn, setUsn] = useState('');
  const [fees, setFees] = useState(''); // New state for fees
  const [concessionPercentage, setConcessionPercentage] = useState(''); // New state for concession
  const [installment, setInstallment] = useState(''); // New state for installment

  const [documentError, setDocumentError] = useState('');
  const [usnError, setUsnError] = useState(false);
  const [feesError, setFeesError] = useState(false); // New state for fees error

  // Update remarks, usn, and new fields state when a new applicant is selected
  useEffect(() => {
    if (applicant) {
      setRemarks(applicant.remarks || '');
      setUsn(applicant.usn || '');
      setFees(applicantFees[applicant.registration.studentId]?.total_amount || ''); // Clear fees for new applicant
      setConcessionPercentage(applicantFees[applicant.registration.studentId]?.concession_perc || ''); // Clear concession for new applicant
      setInstallment(applicantFees[applicant.registration.studentId]?.installment_no || ''); // Clear installment for new applicant
      setDocumentError(''); // Clear document error on new applicant
      setFeesError(false); // Clear fees error
    }
  }, [applicant]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };
  const formatAcademicYear = (year) => {
    return `${year} - ${year + 1}`;
  };

  // Function to view a document (opens in a new tab)
  const viewDocument = (document) => {
    try {
      if (!document.fileContent) {
        setDocumentError("No file content found for this document.");
        return;
      }

      const isBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(document.fileContent);
      let blob;

      if (isBase64) {
        const byteCharacters = atob(document.fileContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: document.mimeType });
      } else {
        const byteNumbers = new Array(document.fileContent.length);
        for (let i = 0; i < document.fileContent.length; i++) {
          byteNumbers[i] = document.fileContent.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: document.mimeType });
      }

      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Error viewing document:", error);
      setDocumentError('Error: Unable to display document. An unexpected error occurred.');
    }
  };

  const handleAcceptClick = () => {
    let isValid = true;
    if (!usn) {
      setUsnError(true);
      isValid = false;
    } else {
      setUsnError(false);
    }
    // Validate fees as required and numeric
    if (!fees || isNaN(Number(fees)) || Number(fees) <= 0) {
      setFeesError(true);
      isValid = false;
    } else {
      setFeesError(false);
    }

    if (isValid) {
      // Pass the new fields to the onAccept handler
      onAccept(applicant, remarks, usn, Number(fees), Number(concessionPercentage), Number(installment));
    }
  };

  const handleRejectClick = () => {
    // No USN or fees are required for rejection
    setUsnError(false);
    setFeesError(false);
    // Pass the new fields to the onReject handler, they might be empty/0
    onReject(applicant, remarks, usn, Number(fees), Number(concessionPercentage), Number(installment));
  };
  const token = sessionStorage.getItem('token'); 
  const config = {
        headers: {
            Authorization: `Bearer ${token}`
      }
  };
    const handleDownloadFile = (studentId, documentType) => {
        const url = `http://localhost:8080/student/downloadById/${studentId}/${documentType}`;
        window.open(url, config, '_blank');
  };
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 1000,
    maxHeight: '90vh',
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    outline: 'none',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="applicant-details-modal-title"
      aria-describedby="applicant-details-modal-description"
      className="backdrop-blur-sm"
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="applicant-details-modal-title" variant="h5" component="h2" className="font-bold text-gray-900 mb-4">
          Applicant Details
        </Typography>
        {applicant && applicant.registration && (
          <div id="applicant-details-modal-description" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Admission ID:</span>
                  <span className="text-gray-800">{applicant.admissionId}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Applicant Name:</span>
                  <span className="text-gray-800">{applicant.registration.name}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Email:</span>
                  <span className="text-gray-800">{applicant.registration.email}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">10th %:</span>
                  <span className="text-gray-800">{applicant.registration.marks10}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">City:</span>
                  <span className="text-gray-800">{applicant.registration.city}</span>
                </div>
              </div>
              {/* Column 2 */}
              <div className="space-y-4">
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Course:</span>
                  <span className="text-gray-800">{courseName || "Loading..."}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Admission Type:</span>
                  <span className="text-gray-800">{applicant.admissionType}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Academic Year:</span>
                  <span className="text-gray-800">{formatAcademicYear(applicant.academicYear)}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">12th %:</span>
                  <span className="text-gray-800">{applicant.registration.marks12}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">State:</span>
                  <span className="text-gray-800">{applicant.registration.state}</span>
                </div>
              </div>
              {/* Column 3 */}
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Phone No.:</span>
                  <span className="text-gray-800">{applicant.registration.phoneNo}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Gender:</span>
                  <span className="text-gray-800">{applicant.registration.gender}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Application Date:</span>
                  <span className="text-gray-800">{formatDate(applicant.applicationDate)}</span>
                </div>
                <div className="p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Address:</span>
                  <span className="text-gray-800">{applicant.registration.address}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                  <span className="font-semibold text-gray-600 block">Status:</span>
                  <span className={`text-${applicant.status === "ACCEPTED" ? "green" : "red"}-800`}>{applicant.status}</span>
                </div>
              </div>
            </div>

            {/* Marks & Documents Section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Documents</h4>
              {documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md shadow-sm">
                      <span className="font-medium text-gray-800">{doc.fileName}</span>
                      <Button onClick={() => handleDownloadFile(applicant.registration.studentId, doc.documentType)} size="small" variant="contained">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">No documents found for this applicant.</div>
              )}
              {documentError && (
                <div className="mt-2 text-red-600">{documentError}</div>
              )}
            </div>

            {/* USN, Fees, Concession, Installment and Remarks Field */}
            <div className="mt-8 pt-4 border-t border-gray-200 space-y-4">
              <TextField
                label="Student USN"
                fullWidth
                variant="outlined"
                type='text'
                value={usn}
                InputProps={applicant.status === "PENDING" ? {
                      readOnly: false,
                    } : {
                      readOnly: true
                    }}
                onChange={(e) => setUsn(e.target.value)}
                className="mt-2"
                error={usnError}
                helperText={usnError ? "USN is required to accept the application." : ""}
              />
              {/* New fields for Fees, Concession Percentage, and Installment */}
                <>
                  <TextField
                    label="Fees"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={fees}
                    onChange={(e) => {
                      setFees(e.target.value);
                      setFeesError(false);
                    }}
                    // Use a ternary operator to conditionally set the InputProps object.
                    InputProps={applicant.status === "PENDING" ? {
                      readOnly: false,
                    } : {
                      readOnly: true
                    }}
                    className="mt-2"
                    error={feesError}
                    helperText={feesError ? "Fees are required and must be a positive number to accept." : ""}
                  />
                  <TextField
                    label="Concession Percentage"
                    fullWidth
                    variant="outlined"
                    type="number" // Ensures numeric input
                    value={concessionPercentage}
                    InputProps={applicant.status === "PENDING" ? {
                      readOnly: false,
                    } : {
                      readOnly: true
                    }}
                    onChange={(e) => setConcessionPercentage(e.target.value)}
                    className="mt-2"
                    inputProps={{ min: 0, max: 100 }} // Concession should be between 0 and 100
                  />
                  <TextField
                    label="Installment"
                    fullWidth
                    InputProps={applicant.status === "PENDING" ? {
                      readOnly: false,
                    } : {
                      readOnly: true
                    }}
                    variant="outlined"
                    type="number" // Ensures numeric input
                    value={installment}
                    onChange={(e) => setInstallment(e.target.value)}
                    className="mt-2"
                    inputProps={{ min: 1 }} // Installment should be at least 1
                  />
                </>
              
              <TextField
                label="Remarks"
                multiline
                InputProps={applicant.status === "PENDING" ? {
                      readOnly: false,
                    } : {
                      readOnly: true
                    }}
                rows={2}
                fullWidth
                variant="outlined"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Action Buttons */}
            {applicant.status === "PENDING" && <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outlined"
                color="error"
                onClick={handleRejectClick}
                className="hover:bg-red-50"
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleAcceptClick}
                className="hover:bg-green-600"
              >
                Accept
              </Button>
            </div>}
          </div>
        )}
      </Box>
    </Modal>
  );
};

// Main ApplicantsContent component
export default function ApplicantsContent() {
  const [applicants, setApplicants] = useState([]);
  const [courseNames, setCourseNames] = useState({});
  const [applicantDocuments, setApplicantDocuments] = useState({});
  const [applicantFees, setApplicantFees] = useState({});
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedFees, setSelectedFees] = useState(null);
  const token = sessionStorage.getItem('token'); 

  // Reusable function for date formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

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
        return `Error: ${response.status}`;
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Failed to fetch course name:", error);
      return "Unknown Course";
    }
  };

  const fetchFeesByStudentId = async(studentId) => {
  const url = `http://localhost:8080/fee/getFees/${studentId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      // Log the response status and text for better debugging
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch fees for studentId: ${studentId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fees:", error);
    return [];
  }
}

  const fetchDocumentsByStudentId = async (studentId) => {
    const url = `http://localhost:8080/documents/getDocumentsByStudentId/${studentId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch documents for studentId: ${studentId}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return []; // Return an empty array on error
    }
  };

  const fetchApplicants = async () => {
    const url = "http://localhost:8080/admissions/getAllAdmissions";

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
      setApplicants(data);

      const uniqueCourseIds = [...new Set(data.map(applicant => applicant.courseId))];

      const courseNamePromises = uniqueCourseIds.map(id => fetchCourseName(id));
      const documentPromises = data.map(applicant =>
        fetchDocumentsByStudentId(applicant.registration.studentId)
      );

      const fetchedCourseNames = await Promise.all(courseNamePromises);
      const fetchedDocuments = await Promise.all(documentPromises);
      const fetchedFees = await Promise.all(data.map(applicant =>
        fetchFeesByStudentId(applicant.registration.studentId)
      ));

      const newCourseNames = uniqueCourseIds.reduce((acc, id, index) => {
        acc[id] = fetchedCourseNames[index];
        return acc;
      }, {});

      const newApplicantDocuments = data.reduce((acc, applicant, index) => {
        acc[applicant.registration.studentId] = fetchedDocuments[index];
        return acc;
      }, {});

      const newApplicantFee = data.reduce((acc, applicant, index) => {
        acc[applicant.registration.studentId] = fetchedFees[index];
        return acc;
      }, {});

      setCourseNames(newCourseNames);
      setApplicantDocuments(newApplicantDocuments);
      setApplicantFees(newApplicantFee);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch Applicants:", error);
      if (error.message.includes('400')) {
        setErrorMsg("Bad Request: Please check the API endpoint and required parameters.");
      } else {
        setErrorMsg("Failed to load Applicants. Please try again later.");
      }
    }
  };

  // NEW FUNCTION: Add Fees
  const addFees = async (studentId, courseId, feesAmount, concession, installments) => {
    const url = "http://localhost:8080/fee/addFees";

    const feeData = {
      studentId: studentId,
      courseId: courseId,
      total_amount: feesAmount,
      concession_perc: concession,
      installment_no: installments,
      installment: installments > 1 ? 'Yes' : 'No'
    };

    if (!token) {
      console.error("Authentication token not found for adding fees.");
      alert("Authentication error: Please log in again.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(feeData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add fees:", errorText);
        alert(`Failed to add fees: ${errorText}`);
        return false; // Indicate failure
      }
      console.log("Fees added successfully!");
      return true; // Indicate success
    } catch (error) {
      console.error("Error adding fees:", error);
      alert("Error adding fees. Please try again later.");
      return false; // Indicate failure
    }
  };

  // This function now receives the full applicant object, remarks, USN, fees, concession, and installment.
  const updateAdmissionStatus = async (applicantToUpdate, status, remarks, usn, feesAmount, concession, installments) => {
    const url = `http://localhost:8080/admissions/updateAdmission/${applicantToUpdate.admissionId}`;

    const admissionUpdate = {
      admissionId: applicantToUpdate.admissionId,
      registration: {
        studentId: applicantToUpdate.registration.studentId,
        status: status
      },
      courseId: applicantToUpdate.courseId,
      courseCode: applicantToUpdate.courseCode,
      admissionType: applicantToUpdate.admissionType,
      academicYear: applicantToUpdate.academicYear,
      status: status,
      applicationDate: applicantToUpdate.applicationDate,
      concessionPercentage: concession, // Use the concession from modal
      remarks: remarks,
      decisionDate: new Date().toISOString(),
      usn: usn
    };

    if (!token) {
      console.error("Authentication token not found for updating admission.");
      alert("Authentication error: Please log in again.");
      return;
    }
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(admissionUpdate)
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to update the Admission: ${errorText}`);
        throw new Error(`Failed to update admission status: ${response.status}`);
      }

      // If admission is ACCEPTED, then add fees
      if (status === 'ACCEPTED') {
        const feesAdded = await addFees(
          applicantToUpdate.registration.studentId,
          applicantToUpdate.courseId,
          feesAmount,
          concession,
          installments
        );
        if (!feesAdded) {
          // If fees adding failed, you might want to revert admission status or just log
          console.error("Admission updated, but fees addition failed.");
          alert("Admission updated, but there was an issue adding fees.");
          // Do not return here, continue with fetchApplicants()
        }
      }

      fetchApplicants(); // Refresh the list after successful update
      alert("Admission Updated!");
    } catch (error) {
      console.error("Error updating admission status:", error);
      alert("Error updating admission status. Please try again later.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const toggleDropdown = (admissionId) => {
    setActiveDropdownId(activeDropdownId === admissionId ? null : admissionId);
  };



  const viewDetails = (applicant, applicantFees) => {
    setSelectedApplicant(applicant);
    setSelectedFees(applicantFees);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.registration.name.toLowerCase().includes(searchTerm.toLowerCase())
    || courseNames[applicant.courseId]?.toLowerCase().includes(searchTerm.toLowerCase())
    || applicant.admissionType.toLowerCase().includes(searchTerm.toLowerCase())
    || applicant.academicYear.toString().includes(searchTerm)
    || applicant.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredApplicants.length) : 0;

  // NEW FUNCTION TO HANDLE EXCEL DOWNLOAD
  const handleDownload = () => {
    // Prepare the data for the Excel sheet
    const dataToExport = filteredApplicants.map(applicant => ({
      'Applicant ID': applicant.admissionId,
      'Applicant Name': applicant.registration.name,
      'Email': applicant.registration.email,
      'Phone No.': applicant.registration.phoneNo,
      'Gender': applicant.registration.gender,
      '10th %': applicant.registration.marks10,
      '12th %': applicant.registration.marks12,
      'City': applicant.registration.city,
      'State': applicant.registration.state,
      'Address': applicant.registration.address,
      'Course': courseNames[applicant.courseId] || "Loading...",
      'Admission Type': applicant.admissionType,
      'Academic Year': `${applicant.academicYear} - ${applicant.academicYear + 1}`,
      'Application Date': formatDate(applicant.applicationDate),
      'Status': applicant.status,
      'Concession Percentage': applicant.concessionPercentage,
      'Remarks': applicant.remarks,
      'Decision Date': applicant.decisionDate ? formatDate(applicant.decisionDate) : 'N/A',
      'USN': applicant.usn || 'N/A',
    }));

    // Create a new worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

    // Generate the Excel file as a binary string
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convert the binary string to a Blob and save it
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'Applicants.xlsx');
  };


  return (
    <div className="bg-gray-50 min-h-screen p-8 flex flex-col font-sans">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h5 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Admission Applicants</h5>
          <div className="flex items-center space-x-4 w-full sm:w-auto"> {/* Adjusted for flex layout */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name, course, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            {/* NEW EXCEL DOWNLOAD BUTTON */}
            <button
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 whitespace-nowrap"
              onClick={handleDownload}
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Applicants Table */}
        <TableContainer component={Paper} className="rounded-xl shadow-md">
          <Table aria-label="applicants table">
            <TableHead>
              <TableRow>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Applicant ID</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Applicant Name</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Course</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Admission Type</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Academic Year</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700">Application Date</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700 text-center">Status</TableCell>
                <TableCell className="px-6 py-4 font-semibold text-gray-700 text-center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredApplicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredApplicants
              ).map((applicant) => (
                <TableRow key={applicant.admissionId} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell className='px-6 py-3'>{applicant.admissionId}</TableCell>
                  <TableCell className='px-6 py-3 font-medium text-gray-900'>{applicant.registration.name}</TableCell>
                  <TableCell className='px-6 py-3'>
                    <Chip
                      label={courseNames[applicant.courseId] || "Loading..."}
                      size="small"
                      color="primary"
                      variant="outlined"
                      className="font-medium"
                    />
                  </TableCell>
                  <TableCell className='px-6 py-3'>{applicant.admissionType}</TableCell>
                  <TableCell className='px-6 py-3'>{`${applicant.academicYear} - ${applicant.academicYear + 1}`}</TableCell>
                  <TableCell className='px-6 py-3'>{formatDate(applicant.applicationDate)}</TableCell>
                  <TableCell align="center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        applicant.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : applicant.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <div className="relative">
                      <IconButton
                        aria-label="more"
                        aria-controls={`options-menu-${applicant.admissionId}`}
                        aria-haspopup="true"
                        onClick={() => toggleDropdown(applicant.admissionId)}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <MoreVertIcon />
                      </IconButton>
                      {activeDropdownId === applicant.admissionId && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right animate-fade-in-up">
                          <div className="py-1">
                            <button
                              onClick={() => viewDetails(applicant, applicantFees)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            >
                              View Details
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
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={8}
                  count={filteredApplicants.length}
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
      </div>

      <ApplicantDetailsModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        applicant={selectedApplicant}
        applicantFees={selectedFees}
        documents={selectedApplicant ? applicantDocuments[selectedApplicant.registration.studentId] : null}
        courseName={selectedApplicant ? courseNames[selectedApplicant.courseId] : null}
        onAccept={(applicant, remarks, usn, fees, concession, installment) => updateAdmissionStatus(applicant, 'ACCEPTED', remarks, usn, fees, concession, installment)}
        onReject={(applicant, remarks, usn, fees, concession, installment) => updateAdmissionStatus(applicant, 'REJECTED', remarks, usn, fees, concession, installment)}
      />
    </div>
  );
}

// Simple Tailwind animation for dropdown
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);
