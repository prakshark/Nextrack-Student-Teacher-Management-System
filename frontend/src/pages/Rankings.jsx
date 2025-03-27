import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Rankings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankings, setRankings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/rankings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRankings(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rankings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Rankings
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Platform</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell align="right">Problems Solved</TableCell>
                      <TableCell align="right">Contest Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        LeetCode
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.leetcode?.rating || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.leetcode?.totalSolved || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.leetcode?.contestRating || 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        CodeChef
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.codechef?.rating || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.codechef?.problemsSolved || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.codechef?.contestRating || 'N/A'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        GitHub
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.github?.score || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.github?.public_repos || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {rankings?.github?.followers || 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Rankings; 