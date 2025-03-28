import { Container, Typography, Box } from '@mui/material';

const Rankings = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" color="text.secondary">
          Inter College Ranking Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default Rankings; 