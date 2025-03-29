import { Box, Container, CssBaseline } from '@mui/material';
import TeacherNavbar from '../components/TeacherNavbar';

const TeacherLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <TeacherNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default TeacherLayout; 