import { Container, Typography } from '@mui/material';

const TeacherAssignmentStatus = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assignment Status
      </Typography>
      <Typography variant="body1">
        This page will show the status of all assignments and student submissions.
      </Typography>
    </Container>
  );
};

export default TeacherAssignmentStatus; 