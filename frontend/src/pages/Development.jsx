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

const Development = () => {
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
        setError(err.response?.data?.message || 'Failed to fetch development profile');
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
        Development Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                GitHub Profile
              </Typography>
              <Typography variant="body1">
                Username: {profile?.githubProfileUrl?.split('/').pop()}
              </Typography>
              <Typography variant="body1">
                Public Repositories: {profile?.rankings?.github?.public_repos || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Followers: {profile?.rankings?.github?.followers || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                LinkedIn Profile
              </Typography>
              <Typography variant="body1">
                Profile URL: {profile?.linkedinProfileUrl}
              </Typography>
              <Typography variant="body1">
                Network Size: {profile?.rankings?.linkedin?.networkSize || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Connections: {profile?.rankings?.linkedin?.connections || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Development; 