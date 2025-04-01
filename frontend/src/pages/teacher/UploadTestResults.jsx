import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadTestResults = () => {
  const [file, setFile] = useState(null);
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateExcelFormat = (data) => {
    const requiredColumns = ['Student Name', 'Student Email', 'Student Marks'];
    const headers = Object.keys(data[0]);
    
    return requiredColumns.every(col => headers.includes(col));
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!file || !testName || !testDate) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          console.log('Parsed Excel Data:', data); // Debug log

          if (!validateExcelFormat(data)) {
            setError('Excel format is incorrect. Please ensure columns are named: Student Name, Student Email, Student Marks');
            setLoading(false);
            return;
          }

          const formattedData = data.map(row => ({
            studentName: row['Student Name'],
            studentEmail: row['Student Email'],
            marks: Number(row['Student Marks']),
            testName,
            testDate: new Date(testDate)
          }));

          console.log('Formatted Data:', formattedData); // Debug log

          const token = localStorage.getItem('token');
          const response = await axios.post(
            'http://localhost:5000/api/teacher/upload-test-results', 
            { results: formattedData },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('API Response:', response.data); // Debug log
          setSuccess(`Test results uploaded successfully! ${response.data.count} records added.`);
          setTestName('');
          setTestDate('');
          setFile(null);
          
          // Reset the file input
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
          
        } catch (error) {
          console.error('Error:', error); // Debug log
          setError('Error processing file: ' + (error.response?.data?.message || error.message));
        }
        setLoading(false);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error:', error); // Debug log
      setError('Error uploading file: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload Test Results
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Test Date"
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Excel File
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>

          {file && (
            <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
              File selected: {file.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading || !file || !testName || !testDate}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadTestResults; 