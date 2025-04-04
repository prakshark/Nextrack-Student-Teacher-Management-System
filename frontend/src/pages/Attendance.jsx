import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  // Modified getDates function to handle 2025
  const getDates = () => {
    const dates = [];
    const currentDate = new Date();
    
    // Ensure we're working with 2025
    if (currentDate.getFullYear() !== 2025) {
      currentDate.setFullYear(2025);
    }
    
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i <= 29; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    // Set to UTC midnight
    d.setUTCHours(0, 0, 0, 0);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view attendance');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/student/attendance', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Raw API Response:', response.data);

        // Transform the attendance data
        const attendanceData = {};
        
        if (Array.isArray(response.data.data)) {
          response.data.data.forEach(record => {
            // Convert the date to UTC midnight
            const date = new Date(record.date);
            date.setUTCHours(0, 0, 0, 0);
            const dateStr = formatDateForAPI(date);
            attendanceData[dateStr] = true; // If record exists, student was present
            console.log(`Processing attendance record: ${dateStr} = Present`);
          });
        }

        console.log('Transformed attendance data:', attendanceData);

        setAttendance(attendanceData);
        
        // Calculate percentage
        const totalDays = Object.keys(attendanceData).length;
        const presentDays = Object.values(attendanceData).filter(present => present).length;
        const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        setAttendancePercentage(percentage);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch attendance data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    // Create headers with dates
    const headers = ['Date', 'Status'];

    // Prepare data for attendance
    const data = dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const status = attendance[dateStr] ? 'Present' : 'Absent';
      return [formatDate(date), status];
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Attendance Report'],
      ['Total Attendance Percentage:', `${attendancePercentage}%`],
      [],
      headers,
      ...data
    ]);

    // Style the worksheet
    ws['!cols'] = [
      { wch: 15 }, // Date column
      { wch: 15 }  // Status column
    ];

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'My Attendance');

    // Generate Excel file
    XLSX.writeFile(wb, 'my_attendance_report.xlsx');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">
          My Attendance
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </Stack>

      <Card sx={{ mb: 4, bgcolor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Overall Attendance
          </Typography>
          <Typography variant="h3" color={attendancePercentage >= 75 ? 'success.main' : 'error.main'}>
            {attendancePercentage}%
          </Typography>
          {attendancePercentage < 75 && (
            <Typography color="error" sx={{ mt: 1 }}>
              Your attendance is below the required 75%
            </Typography>
          )}
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dates.map((date) => {
              const dateStr = formatDateForAPI(date);
              const isPresent = !!attendance[dateStr];

              console.log('Checking attendance for:', dateStr, 'Present:', isPresent, 'Raw value:', attendance[dateStr]);

              return (
                <TableRow 
                  key={dateStr}
                  sx={{
                    bgcolor: date.toDateString() === new Date().toDateString() ? '#e3f2fd' : 'inherit'
                  }}
                >
                  <TableCell>{formatDate(date)}</TableCell>
                  <TableCell>
                    <Typography 
                      color={isPresent ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      {isPresent ? 'Present' : 'Absent'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Attendance; 