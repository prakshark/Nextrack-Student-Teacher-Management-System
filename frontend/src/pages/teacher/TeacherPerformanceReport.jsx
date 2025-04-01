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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';

const TeacherPerformanceReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalAssignments, setTotalAssignments] = useState({ easy: 0, medium: 0, hard: 0 });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentStatus, setAssignmentStatus] = useState({ completed: [], notCompleted: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view performance report');
          setLoading(false);
          return;
        }

        // Fetch all assignments to get total counts
        const assignmentsResponse = await axios.get('http://localhost:5000/api/teacher/assignments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Calculate total assignments by difficulty
        const counts = assignmentsResponse.data.data.reduce((acc, assignment) => {
          const difficulty = assignment.difficulty.toLowerCase();
          acc[difficulty] = (acc[difficulty] || 0) + 1;
          return acc;
        }, { easy: 0, medium: 0, hard: 0 });

        setTotalAssignments(counts);

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

  const handleAssignmentClick = async (difficulty) => {
    try {
      console.log('\n=== Starting Assignment Status Fetch ===');
      console.log('Difficulty:', difficulty);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch assignment status for the selected difficulty
      const response = await axios.get(`/api/teacher/assignment-status/${difficulty}`, { headers });
      console.log('Assignment status response:', response.data);
      
      if (response.data.success) {
        setSelectedAssignment(difficulty);
        
        // Process the data to show all assignments of this difficulty
        const processedStatus = {
          completed: [],
          notCompleted: []
        };
        
        // Get all unique students from all assignments
        const studentMap = new Map();
        
        // Process each assignment's data
        Object.values(response.data.data).forEach(assignment => {
          console.log(`\nProcessing assignment: ${assignment.title}`);
          console.log('Completed students:', assignment.completed.length);
          console.log('Not completed students:', assignment.notCompleted.length);
          
          // Add completed students
          assignment.completed.forEach(student => {
            if (!studentMap.has(student._id)) {
              studentMap.set(student._id, {
                ...student,
                completedAssignments: 1
              });
            } else {
              studentMap.get(student._id).completedAssignments++;
            }
          });
          
          // Add not completed students
          assignment.notCompleted.forEach(student => {
            if (!studentMap.has(student._id)) {
              studentMap.set(student._id, {
                ...student,
                completedAssignments: 0
              });
            }
          });
        });
        
        // Convert map to arrays
        Array.from(studentMap.values()).forEach(student => {
          if (student.completedAssignments > 0) {
            processedStatus.completed.push(student);
          } else {
            processedStatus.notCompleted.push(student);
          }
        });
        
        console.log('\nFinal processed status:', processedStatus);
        setAssignmentStatus(processedStatus);
      }
    } catch (error) {
      console.error('\n=== Error in Assignment Status Fetch ===');
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        response: error.response?.data
      });
      console.error('=== End of Error Details ===\n');
      setError('Failed to fetch assignment status');
    }
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
              <TableCell 
                sx={{ 
                  minWidth: 150, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => handleAssignmentClick('easy')}
              >
                Assignments (Easy) ({totalAssignments.easy} total)
              </TableCell>
              <TableCell 
                sx={{ 
                  minWidth: 150, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => handleAssignmentClick('medium')}
              >
                Assignments (Medium) ({totalAssignments.medium} total)
              </TableCell>
              <TableCell 
                sx={{ 
                  minWidth: 150, 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={() => handleAssignmentClick('hard')}
              >
                Assignments (Hard) ({totalAssignments.hard} total)
              </TableCell>
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

      {/* Assignment Status Dialog */}
      {selectedAssignment && (
        <Dialog
          open={Boolean(selectedAssignment)}
          onClose={() => setSelectedAssignment(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Assignment Status - {selectedAssignment.charAt(0).toUpperCase() + selectedAssignment.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Completed ({assignmentStatus.completed.length})
              </Typography>
              <List>
                {assignmentStatus.completed.map((student) => (
                  <ListItem key={student._id}>
                    <ListItemText
                      primary={student.name}
                      secondary={`${student.email} (${student.completedAssignments} assignments completed)`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Not Completed ({assignmentStatus.notCompleted.length})
              </Typography>
              <List>
                {assignmentStatus.notCompleted.map((student) => (
                  <ListItem key={student._id}>
                    <ListItemText
                      primary={student.name}
                      secondary={student.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedAssignment(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default TeacherPerformanceReport; 