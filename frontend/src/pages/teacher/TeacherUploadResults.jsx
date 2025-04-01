import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TeacherUploadResults = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const validateExcelFormat = (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }

    const requiredColumns = ['Student Name', 'Student Email', 'Student Marks'];
    const firstRow = jsonData[0];
    const columns = Object.keys(firstRow);

    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!testName.trim()) {
      setError('Please enter a test name');
      return;
    }

    if (!testDate) {
      setError('Please select a test date');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Validate Excel format
          validateExcelFormat(jsonData);

          // Format the data according to TestResult model
          const formattedData = jsonData.map(row => ({
            studentName: row['Student Name'],
            studentEmail: row['Student Email'],
            testName: testName,
            testDate: new Date(testDate),
            marks: parseFloat(row['Student Marks'])
          }));

          console.log('Sending data to:', `${API_URL}/api/teacher/upload-test-results`);
          console.log('Formatted data:', formattedData);

          // Send the data to the backend
          const response = await axios.post(
            `${API_URL}/api/teacher/upload-test-results`,
            { results: formattedData },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('API Response:', response.data);
          setSuccess('Test results uploaded successfully!');
          setFile(null);
          setTestName('');
          setTestDate('');
        } catch (err) {
          console.error('Error processing file:', err);
          if (err.response) {
            console.error('Error response:', err.response.data);
            setError(err.response.data.message || 'Error uploading test results');
          } else if (err.request) {
            console.error('Error request:', err.request);
            setError('No response from server. Please check if the server is running.');
          } else {
            console.error('Error message:', err.message);
            setError(err.message || 'Error processing the file. Please check the format.');
          }
        } finally {
          setLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Error reading the file. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Test Results
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Please fill in the test details and upload an Excel file with the following columns:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
            <li>Student Name</li>
            <li>Student Email</li>
            <li>Student Marks</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            fullWidth
            variant="outlined"
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Test Date"
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            fullWidth
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: '.xlsx,.xls' }}
            fullWidth
            variant="outlined"
            disabled={loading}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || !testName || !testDate || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {loading ? 'Uploading...' : 'Upload Results'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherUploadResults; 