import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DSAProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch DSA profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        DSA Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LeetCode Profile
              </Typography>
              <Typography variant="body1">
                Username: {profile?.leetcodeProfileUrl?.split('/').pop()}
              </Typography>
              <Typography variant="body1">
                Problems Solved: {profile?.rankings?.leetcode?.totalSolved || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Contest Rating: {profile?.rankings?.leetcode?.contestRating || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CodeChef Profile
              </Typography>
              <Typography variant="body1">
                Username: {profile?.codechefProfileUrl?.split('/').pop()}
              </Typography>
              <Typography variant="body1">
                Rating: {profile?.rankings?.codechef?.rating || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Problems Solved: {profile?.rankings?.codechef?.problemsSolved || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DSAProfile; 