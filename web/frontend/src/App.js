import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar, IconButton, Snackbar, Divider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Cookies from 'js-cookie';
import ProtectedRoute from './security/ProtectedRoute';
import UpcomingTasks from './components/UpcomingTasks';
import TaskForm from './components/TaskForm';
import Login from './pages/Login';

function App() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({ username: '' });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
    });
    const [tasksRefreshKey, setTasksRefreshKey] = useState(0);

    useEffect(() => {
      let isUserInfoSet = false;
      if (process.env.REACT_APP_ENV === 'development') {
        // Mock the authentication flow
        const mockUserInfo = { username: 'testuser', name: 'Test User' };
        localStorage.setItem('userDetails', JSON.stringify(mockUserInfo));
        isUserInfoSet = true;
      }
  
      const storedUserDetails = localStorage.getItem('userDetails');
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        setUserDetails(userDetails);
        setLoggedIn(true);
        isUserInfoSet = true;
      }
  
      if (!isUserInfoSet) {
        const encodedUserInfo = Cookies.get('userinfo');
        if (encodedUserInfo) {
          const userInfo = JSON.parse(atob(encodedUserInfo));
          setUserDetails(userInfo);
          setLoggedIn(true);
          localStorage.setItem('userDetails', JSON.stringify(userInfo));
        }
      }
  
      setLoading(false); // Set loading to false after authentication check is complete
    }, []);

    const handleLogout = () => {
      // Clear any stored user information
      setUserDetails({});
      setLoggedIn(false);
      localStorage.removeItem('userDetails');
  
      // Redirect to Choreo logout with session_hint
      const sessionHint = Cookies.get('session_hint');
      window.location.href = `/auth/logout?session_hint=${sessionHint}`;
  
      Cookies.remove('userinfo', { path: '/' });
    };
  
    const triggerTaskRefresh = () => {
      setTasksRefreshKey(prevKey => prevKey + 1);
    };
   
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenSnackbar = (message) => {
      setSnackbar({ open: true, message });
    };

    if (loading) {
      return <div>Loading...</div>; // Or a more sophisticated loading indicator
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <AppBar position="static" color="primary">
                  <Toolbar>
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          TaskMaster  - Empowering Your Productivity Journey
                      </Typography>
                      {loggedIn && (
                      <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToAppIcon />
                      </IconButton>
                      )}
                  </Toolbar>
              </AppBar>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
                  <Route path="/" element={
                      <Container maxWidth="sm">
                      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h5" style={{ marginBottom: 20 }}>
                            Welcome, {userDetails.name}
                          </Typography>
                          <TaskForm userDetails={userDetails} onAddTask={triggerTaskRefresh} handleOpenSnackbar={handleOpenSnackbar}/>
                          <Divider style={{ margin: '20px 0' }} />
                          <UpcomingTasks email={userDetails.email} triggerRefresh={tasksRefreshKey} />
                      </Box>
                  </Container>
                  } />
                  </Route>
              </Routes>
            </Router>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </ThemeProvider>
    );
}

export default App;
