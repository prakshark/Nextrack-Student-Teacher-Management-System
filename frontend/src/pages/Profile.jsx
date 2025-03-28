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
  TextField,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    leetcodeUsername: '',
    codechefUsername: '',
    githubUsername: '',
    linkedinProfileUrl: '',
    college: '',
    course: '',
    yearOfStudy: ''
  });
  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Profile page - Fetching profile data');
        const response = await axios.get('http://localhost:5000/api/student/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Profile page - Profile data received:', response.data.data);
        console.log('Profile page - GitHub username from response:', response.data.data.githubUsername);
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          phone: response.data.data.phone || '',
          leetcodeUsername: response.data.data.leetcodeUsername || '',
          codechefUsername: response.data.data.codechefUsername || '',
          githubUsername: response.data.data.githubUsername || '',
          linkedinProfileUrl: response.data.data.linkedinProfileUrl || '',
          college: response.data.data.college || '',
          course: response.data.data.course || '',
          yearOfStudy: response.data.data.yearOfStudy || ''
        });
        console.log('Profile page - Form data set:', formData);
        console.log('Profile page - GitHub username in form data:', formData.githubUsername);
      } catch (err) {
        console.error('Profile page - Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    console.log('Profile page - Form field changed:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditClick = () => {
    console.log('Profile page - Edit button clicked');
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    console.log('Profile page - Cancel button clicked');
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile page - Form submitted');
    try {
      // Validate required fields
      const missingFields = [];
      if (!formData.leetcodeUsername) missingFields.push('LeetCode Username');
      if (!formData.codechefUsername) missingFields.push('CodeChef Username');
      if (!formData.phone) missingFields.push('Phone');

      if (missingFields.length > 0) {
        console.log('Profile page - Validation failed:', {
          leetcodeUsername: formData.leetcodeUsername,
          codechefUsername: formData.codechefUsername,
          phone: formData.phone
        });
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Profile page - Submitting profile update with data:', formData);
      console.log('Profile page - GitHub username being sent:', formData.githubUsername);
      console.log('Profile page - Required fields being sent:', {
        leetcodeUsername: formData.leetcodeUsername,
        codechefUsername: formData.codechefUsername,
        phone: formData.phone
      });

      const response = await axios.put(
        'http://localhost:5000/api/student/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      console.log('Profile page - Profile update response:', response.data);
      console.log('Profile page - GitHub username in response:', response.data.data.githubUsername);
      setProfile(response.data.data);
      setIsEditing(false);
      setError(null);

      // Update user context with the new data
      const userData = {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        userType: 'student',
        leetcodeUsername: response.data.data.leetcodeUsername,
        codechefUsername: response.data.data.codechefUsername,
        githubUsername: response.data.data.githubUsername
      };
      console.log('Profile page - Updating user context with:', userData);
      console.log('Profile page - GitHub username in user context:', userData.githubUsername);
      setUser(userData);
    } catch (err) {
      console.error('Profile page - Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 3 }}
              src={profile?.profilePicture}
            >
              {profile?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">{profile?.name}</Typography>
              <Typography color="textSecondary">{profile?.email}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="College"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year of Study"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Coding Profiles
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LeetCode Username"
                  name="leetcodeUsername"
                  value={formData.leetcodeUsername}
                  onChange={handleChange}
                  disabled={!isEditing}
                  helperText="Enter only your LeetCode username (e.g., prakshark)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CodeChef Username"
                  name="codechefUsername"
                  value={formData.codechefUsername}
                  onChange={handleChange}
                  disabled={!isEditing}
                  helperText="Enter only your CodeChef username (e.g., prakshark)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub Username"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                  disabled={!isEditing}
                  helperText="Enter only your GitHub username (e.g., prakshark)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile URL"
                  name="linkedinProfileUrl"
                  value={formData.linkedinProfileUrl}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={() => console.log('Profile page - Save button clicked')}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile; 