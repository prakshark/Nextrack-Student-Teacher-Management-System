import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import TeacherLayout from './layouts/TeacherLayout';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DSAProfile from './pages/DSAProfile';
import Development from './pages/Development';
import Assignments from './pages/Assignments';
import Rankings from './pages/Rankings';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';

// Import teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherDSASubmissions from './pages/teacher/TeacherDSASubmissions';
import TeacherDevProfiles from './pages/teacher/TeacherDevProfiles';
import TeacherCreateAssignment from './pages/teacher/TeacherCreateAssignment';
import TeacherAssignmentStatus from './pages/teacher/TeacherAssignmentStatus';
import AssignmentStatusDetail from './pages/teacher/AssignmentStatusDetail';
import TeacherPerformanceReport from './pages/teacher/TeacherPerformanceReport';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import ExcelInsights from './pages/teacher/ExcelInsights';
import TeacherUploadResults from './pages/teacher/TeacherUploadResults';
import TeacherTestResults from './pages/teacher/TeacherTestResults';
import TeacherTestResultDetails from './pages/teacher/TeacherTestResultDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dsa-profile"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <DSAProfile />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/development"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Development />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Assignments />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Attendance />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/rankings"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Rankings />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/dashboard"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherDashboard />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/profile"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherProfile />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/student-profiles"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherDSASubmissions />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/dev-profiles"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherDevProfiles />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/create-assignment"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherCreateAssignment />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/assignment-status"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherAssignmentStatus />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/assignment-status/:assignmentId"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <AssignmentStatusDetail />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/performance-report"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherPerformanceReport />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherAttendance />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route path="/teacher/excel-insights" element={<ExcelInsights />} />
            <Route
              path="/teacher/upload-results"
              element={
                <PrivateRoute>
                  <TeacherLayout>
                    <TeacherUploadResults />
                  </TeacherLayout>
                </PrivateRoute>
              }
            />
            <Route path="/teacher/test-results" element={
              <PrivateRoute>
                <TeacherLayout>
                  <TeacherTestResults />
                </TeacherLayout>
              </PrivateRoute>
            } />
            <Route path="/teacher/test-results/:testId" element={
              <PrivateRoute>
                <TeacherLayout>
                  <TeacherTestResultDetails />
                </TeacherLayout>
              </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 