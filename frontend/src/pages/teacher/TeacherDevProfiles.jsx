import { Container, Typography } from '@mui/material';

const TeacherDevProfiles = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Development Profiles
      </Typography>
      <Typography variant="body1">
        This page will display student development profiles and their GitHub/LinkedIn information.
      </Typography>
    </Container>
  );
};

export default TeacherDevProfiles; 