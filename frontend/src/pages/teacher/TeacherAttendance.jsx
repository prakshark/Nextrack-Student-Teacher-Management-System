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
  TextField,
  Box,
  Checkbox,
  Stack,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';

const TeacherAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get dates for the last 30 days
  const getDates = () => {
    const dates = [];
    const currentDate = new Date();
    
    // Ensure we're working with the correct year (2025)
    if (currentDate.getFullYear() !== 2025) {
      currentDate.setFullYear(2025);
    }
    
    currentDate.setHours(0, 0, 0, 0); // Set to start of day
    
    for (let i = 0; i <= 29; i++) {
      const date = new Date(currentDate); // Clone current date
      date.setDate(currentDate.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view attendance');
          setLoading(false);
          return;
        }

        // Fetch students and attendance data
        const [studentsResponse, attendanceResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/teacher/students', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://localhost:5000/api/teacher/attendance', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        // Add console.log to debug initial data
        console.log('Initial students:', studentsResponse.data.data);
        console.log('Initial attendance:', attendanceResponse.data.data);

        setStudents(studentsResponse.data.data);
        setAttendance(attendanceResponse.data.data || {});
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch attendance data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    // Set time to noon to avoid timezone issues
    d.setHours(12, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  const handleAttendanceChange = async (studentId, date) => {
    const dateStr = formatDateForAPI(date);
    const today = new Date();
    
    // Set today to 2025 for comparison
    if (today.getFullYear() !== 2025) {
      today.setFullYear(2025);
    }
    today.setHours(0, 0, 0, 0);

    // Date validation
    if (date > today) {
      console.log('Cannot mark attendance for future dates:', dateStr);
      return;
    }

    // Check if the date is more than 30 days old
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    if (date < thirtyDaysAgo) {
      console.log('Cannot mark attendance for dates older than 30 days:', dateStr);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/teacher/attendance',
        {
          studentId,
          date: dateStr,
          present: !attendance[studentId]?.[dateStr]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Previous attendance:', attendance);
      console.log('Response data:', response.data.data);
      setAttendance(response.data.data);
      console.log('Updated attendance:', response.data.data);
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Failed to update attendance. Please try again.');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadExcel = () => {
    // Create headers with dates
    const headers = ['Name', 'Email', ...dates.map(date => formatDate(date))];

    // Prepare data for each student
    const data = filteredStudents.map(student => {
      const row = [student.name, student.email];
      
      // Add attendance status for each date
      dates.forEach(date => {
        const dateStr = formatDateForAPI(date);
        const isPresent = attendance[student._id]?.[dateStr];
        row.push(isPresent ? 'Present' : 'Absent');
      });

      return row;
    });

    // Calculate attendance statistics
    const statistics = filteredStudents.map(student => {
      let totalPresent = 0;
      let totalDays = 0;

      dates.forEach(date => {
        const dateStr = formatDateForAPI(date);
        if (attendance[student._id]?.[dateStr] !== undefined) {
          totalDays++;
          if (attendance[student._id][dateStr]) {
            totalPresent++;
          }
        }
      });

      const attendancePercentage = totalDays > 0 
        ? ((totalPresent / totalDays) * 100).toFixed(2) 
        : '0.00';

      return [
        student.name,
        student.email,
        totalPresent,
        totalDays,
        `${attendancePercentage}%`
      ];
    });

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();

    // Add attendance sheet
    const attendanceWS = XLSX.utils.aoa_to_sheet([headers, ...data]);
    XLSX.utils.book_append_sheet(wb, attendanceWS, 'Attendance');

    // Add statistics sheet
    const statisticsWS = XLSX.utils.aoa_to_sheet([
      ['Name', 'Email', 'Days Present', 'Total Days', 'Attendance %'],
      ...statistics
    ]);
    XLSX.utils.book_append_sheet(wb, statisticsWS, 'Statistics');

    // Style the worksheets
    const wsStyles = {
      '!cols': [
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        ...dates.map(() => ({ wch: 12 })) // Date columns
      ]
    };
    attendanceWS['!cols'] = wsStyles['!cols'];
    statisticsWS['!cols'] = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Days Present
      { wch: 15 }, // Total Days
      { wch: 15 }  // Attendance %
    ];

    // Generate Excel file
    XLSX.writeFile(wb, 'attendance_report.xlsx');
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
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">
          Student Attendance
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

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Students"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 'calc(100vh - 250px)',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader sx={{ minWidth: 1500 }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  minWidth: 150, 
                  position: 'sticky', 
                  left: 0, 
                  backgroundColor: 'white', 
                  zIndex: 1000 
                }}
              >
                Name
              </TableCell>
              <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
              {dates.map(date => (
                <TableCell 
                  key={date.toISOString()} 
                  sx={{ 
                    minWidth: 100,
                    backgroundColor: date.toDateString() === new Date().toDateString() ? '#e3f2fd' : 'white'
                  }}
                >
                  {formatDate(date)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell 
                  sx={{ 
                    position: 'sticky', 
                    left: 0, 
                    backgroundColor: 'white', 
                    zIndex: 900 
                  }}
                >
                  {student.name}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                {dates.map(date => {
                  const dateStr = formatDateForAPI(date);
                  const today = new Date();
                  today.setHours(12, 0, 0, 0);
                  const isDisabled = date > today;

                  // Add console.log to debug checkbox state
                  console.log('Checkbox state for', student.name, dateStr, ':', !!attendance[student._id]?.[dateStr]);

                  return (
                    <TableCell 
                      key={date.toISOString()}
                      sx={{
                        backgroundColor: date.toDateString() === new Date().toDateString() ? '#e3f2fd' : 'white'
                      }}
                    >
                      <Checkbox
                        checked={!!attendance[student._id]?.[dateStr]}
                        onChange={() => handleAttendanceChange(student._id, date)}
                        disabled={isDisabled}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeacherAttendance; 