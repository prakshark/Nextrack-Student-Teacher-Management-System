import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AssignmentStatusDetail = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [students, setStudents] = useState({ completed: [], notCompleted: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('\n=== Starting Assignment Status Detail Fetch ===');
        console.log('Assignment ID:', assignmentId);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view assignment status');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch assignment details and status in parallel
        const [assignmentRes, statusRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/teacher/assignments/${assignmentId}`, { headers }),
          axios.get(`http://localhost:5000/api/teacher/assignment-status/${assignmentId}`, { headers })
        ]);

        console.log('Assignment details:', assignmentRes.data);
        console.log('Assignment status:', statusRes.data);
        
        if (assignmentRes.data.success && statusRes.data.success) {
          setAssignment(assignmentRes.data.data);
          
          // Process the status data
          const statusData = statusRes.data.data;
          const processedStudents = {
            completed: [],
            notCompleted: []
          };

          // Get the assignment data
          const assignmentData = statusData[assignmentId];
          console.log('\nAssignment data:', assignmentData);

          if (assignmentData) {
            processedStudents.completed = assignmentData.completed || [];
            processedStudents.notCompleted = assignmentData.notCompleted || [];
          }

          console.log('\nProcessed students:', processedStudents);
          setStudents(processedStudents);
        }

        setLoading(false);
      } catch (err) {
        console.error('\n=== Error in Assignment Status Detail Fetch ===');
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          response: err.response?.data
        });
        console.error('=== End of Error Details ===\n');
        
        setError('Failed to fetch assignment status. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterStudents = (studentList) => {
    if (!Array.isArray(studentList)) return [];
    return studentList.filter(student =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {assignment && (
        <>
          <Typography variant="h4" gutterBottom>
            {assignment.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Due: {new Date(assignment.deadline).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Difficulty: {assignment.difficulty.charAt(0).toUpperCase() + assignment.difficulty.slice(1)}
          </Typography>
        </>
      )}

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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Completed (${students.completed?.length || 0})`} />
          <Tab label={`Not Completed (${students.notCompleted?.length || 0})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Completion Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterStudents(students.completed).map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.completedAt ? new Date(student.completedAt).toLocaleString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterStudents(students.notCompleted).map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Container>
  );
};

export default AssignmentStatusDetail; 