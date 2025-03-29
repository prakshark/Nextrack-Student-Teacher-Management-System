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
  Divider,
  Button,
  Tooltip,
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
  ArcElement,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  BarElement
);

const DSAProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if usernames exist
        if (!user?.leetcodeUsername) {
          setError('Please update your profile with Leetcode username');
          setLoading(false);
          return;
        }

        if (!user?.codechefUsername) {
          setError('Please update your profile with Codechef username');
          setLoading(false);
          return;
        }

        // Fetch Leetcode data
        try {
          const leetcodeResponse = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${user.leetcodeUsername}`);
          console.log('Leetcode API Response:', leetcodeResponse.data);
          setLeetcodeData(leetcodeResponse.data);
        } catch (leetcodeErr) {
          console.error('Error fetching Leetcode data:', leetcodeErr);
          setLeetcodeData(null);
        }

        // Fetch Codechef data
        try {
          const codechefResponse = await axios.get(`https://codechef-api.vercel.app/${user.codechefUsername}`);
          console.log('Codechef API Response:', codechefResponse.data);
          setCodechefData(codechefResponse.data);
        } catch (codechefErr) {
          console.error('Error fetching Codechef data:', codechefErr);
          setCodechefData(null);
        }

      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const leetcodeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Leetcode Problem Solving Progress'
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const codechefChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Codechef Rating Progress'
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

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
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/profile')}>
              Update Profile
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        DSA Profile
      </Typography>

      {/* Leetcode Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Leetcode Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Problem Solving Statistics
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: ['Easy', 'Medium', 'Hard', 'Total'],
                      datasets: [
                        {
                          label: 'Solved Problems',
                          data: [
                            leetcodeData?.easySolved || 0,
                            leetcodeData?.mediumSolved || 0,
                            leetcodeData?.hardSolved || 0,
                            leetcodeData?.totalSolved || 0
                          ],
                          backgroundColor: '#1976d2',
                          borderColor: '#1976d2',
                          borderWidth: 1
                        },
                        {
                          label: 'Total Questions',
                          data: [
                            leetcodeData?.totalEasy || 0,
                            leetcodeData?.totalMedium || 0,
                            leetcodeData?.totalHard || 0,
                            leetcodeData?.totalQuestions || 0
                          ],
                          backgroundColor: '#2e7d32',
                          borderColor: '#2e7d32',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Problem Solving Progress'
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
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Profile Overview
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Username: {user?.leetcodeUsername || 'Not provided'}
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ mt: 2 }}>
                    Ranking: #{leetcodeData?.ranking || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Summary:
                  </Typography>
                  <Typography variant="body1">
                    • Easy: {leetcodeData?.easySolved || 0} / {leetcodeData?.totalEasy || 0}
                  </Typography>
                  <Typography variant="body1">
                    • Medium: {leetcodeData?.mediumSolved || 0} / {leetcodeData?.totalMedium || 0}
                  </Typography>
                  <Typography variant="body1">
                    • Hard: {leetcodeData?.hardSolved || 0} / {leetcodeData?.totalHard || 0}
                  </Typography>
                  <Typography variant="body1">
                    • Total: {leetcodeData?.totalSolved || 0} / {leetcodeData?.totalQuestions || 0}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href={`https://leetcode.com/${user?.leetcodeUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                  >
                    View Leetcode Profile
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Codechef Section */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Codechef Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                  Rating Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: ['Current Rating', 'Highest Rating', 'Global Rank', 'Country Rank'],
                      datasets: [
                        {
                          label: 'Profile Statistics',
                          data: [
                            codechefData?.currentRating || 0,
                            codechefData?.highestRating || 0,
                            codechefData?.globalRank || 0,
                            codechefData?.countryRank || 0
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
                            text: 'Value'
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
                    Username: {codechefData?.name || 'Not provided'}
                  </Typography>
                  <Typography variant="body1">
                    Current Rating: {codechefData?.currentRating || 'Unrated'}
                  </Typography>
                  <Typography variant="body1">
                    Highest Rating: {codechefData?.highestRating || 'Unrated'}
                  </Typography>
                  <Typography variant="body1">
                    Global Rank: #{codechefData?.globalRank || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Country Rank: #{codechefData?.countryRank || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Stars: {codechefData?.stars || 'Unrated'}
                  </Typography>
                  <Typography variant="body1">
                    Country: {codechefData?.countryName || 'N/A'}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href={`https://www.codechef.com/users/${codechefData?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                  >
                    View Codechef Profile
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DSAProfile; 