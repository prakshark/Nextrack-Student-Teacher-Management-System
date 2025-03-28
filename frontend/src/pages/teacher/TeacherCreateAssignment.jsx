import { Container, Typography } from '@mui/material';

const TeacherCreateAssignment = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Assignment
      </Typography>
      <Typography variant="body1">
        This page will allow teachers to create new assignments for students.
      </Typography>
    </Container>
  );
};

export default TeacherCreateAssignment; 