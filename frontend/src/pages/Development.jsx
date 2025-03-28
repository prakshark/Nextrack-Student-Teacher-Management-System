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
  Paper,
  Button,
  Chip
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  BarElement
);

const Development = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Development page - Current user context:', user);
        console.log('Development page - GitHub username:', user?.githubUsername);

        // Check if GitHub username exists
        if (!user?.githubUsername) {
          console.log('Development page - No GitHub username found in user context');
          setError('Please update your profile with GitHub username');
          setLoading(false);
          return;
        }

        // Fetch GitHub data
        try {
          console.log('Development page - Fetching GitHub data for username:', user.githubUsername);
          const githubResponse = await axios.get(`https://api.github.com/users/${user.githubUsername}`);
          console.log('Development page - GitHub API Response:', githubResponse.data);
          setGithubData(githubResponse.data);
        } catch (githubErr) {
          console.error('Development page - Error fetching GitHub data:', githubErr);
          setGithubData(null);
        }

      } catch (err) {
        console.error('Development page - General error:', err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Development Profile
      </Typography>

      {/* GitHub Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            GitHub Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  GitHub Statistics
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: ['Public Repos', 'Public Gists', 'Followers', 'Following'],
                      datasets: [
                        {
                          label: 'GitHub Stats',
                          data: [
                            githubData?.public_repos || 0,
                            githubData?.public_gists || 0,
                            githubData?.followers || 0,
                            githubData?.following || 0
                          ],
                          backgroundColor: [
                            '#1976d2',
                            '#2e7d32',
                            '#ed6c02',
                            '#9c27b0'
                          ],
                          borderColor: [
                            '#1976d2',
                            '#2e7d32',
                            '#ed6c02',
                            '#9c27b0'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: 'Profile Statistics'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Count'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Profile Overview
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Username: {githubData?.login || 'Not provided'}
                  </Typography>
                  <Typography variant="body1">
                    Name: {githubData?.name || 'Not provided'}
                  </Typography>
                  <Typography variant="body1">
                    Bio: {githubData?.bio || 'No bio provided'}
                  </Typography>
                  <Typography variant="body1">
                    Location: {githubData?.location || 'Not specified'}
                  </Typography>
                  <Typography variant="body1">
                    Company: {githubData?.company || 'Not specified'}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href={githubData?.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View GitHub Profile
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Development; 