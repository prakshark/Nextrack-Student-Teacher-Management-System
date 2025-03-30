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
  Button,
  Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';

const TeacherPerformanceReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view performance report');
          setLoading(false);
          return;
        }

        // Fetch all students with their performance data
        const response = await axios.get('http://localhost:5000/api/teacher/student-performance', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setStudents(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch student performance data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const excelData = students.map(student => ({
      'Name': student.name,
      'Email': student.email,
      'LeetCode Ranking': student.rankings?.leetcode?.ranking || 'N/A',
      'CodeChef Highest Rating': student.rankings?.codechef?.highestRating || 'N/A',
      'Assignments Completed (Easy)': student.completedAssignments?.easy || 0,
      'Assignments Completed (Medium)': student.completedAssignments?.medium || 0,
      'Assignments Completed (Hard)': student.completedAssignments?.hard || 0
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Performance');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'student_performance_report.xlsx');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Student Performance Report
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
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150, position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1000 }}>Name</TableCell>
              <TableCell sx={{ minWidth: 200, position: 'sticky', left: 150, backgroundColor: 'white', zIndex: 1000 }}>Email</TableCell>
              <TableCell sx={{ minWidth: 150 }}>LeetCode Ranking</TableCell>
              <TableCell sx={{ minWidth: 150 }}>CodeChef Highest Rating</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Assignments (Easy)</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Assignments (Medium)</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Assignments (Hard)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 900 }}>
                  {student.name}
                </TableCell>
                <TableCell sx={{ position: 'sticky', left: 150, backgroundColor: 'white', zIndex: 900 }}>
                  {student.email}
                </TableCell>
                <TableCell>{student.rankings?.leetcode?.ranking || 'N/A'}</TableCell>
                <TableCell>{student.rankings?.codechef?.highestRating || 'N/A'}</TableCell>
                <TableCell>{student.completedAssignments?.easy || 0}</TableCell>
                <TableCell>{student.completedAssignments?.medium || 0}</TableCell>
                <TableCell>{student.completedAssignments?.hard || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeacherPerformanceReport; 