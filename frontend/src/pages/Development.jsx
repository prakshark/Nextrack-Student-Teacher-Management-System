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
  Button
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Development = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(response.data.data);

        // If we have a GitHub username, fetch GitHub data
        if (response.data.data?.githubUsername) {
          try {
            const githubResponse = await axios.get(`https://api.github.com/users/${response.data.data.githubUsername}`);
            setGithubData(githubResponse.data);
          } catch (githubErr) {
            console.error('Failed to fetch GitHub data:', githubErr);
          }
        }
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
                Username: {profile?.githubUsername || 'Not provided'}
              </Typography>
              <Typography variant="body1">
                Public Repositories: {githubData?.public_repos || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Followers: {githubData?.followers || 'N/A'}
              </Typography>
              {profile?.githubUsername && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  View GitHub Profile
                </Button>
              )}
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
                Username: {profile?.linkedinUsername || 'Not provided'}
              </Typography>
              {profile?.linkedinUsername && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  href={`https://linkedin.com/in/${profile.linkedinUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  View LinkedIn Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Development; 