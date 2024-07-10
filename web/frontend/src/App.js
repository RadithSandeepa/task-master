import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import ProtectedRoute from './security/ProtectedRoute';
import Login from './pages/login/Login';
import { motion } from 'framer-motion';
import "./app.scss";
import Home from './pages/home/Home';
import {  ThemeProvider } from '@emotion/react';
import theme from './theme';

function App() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({ username: '' });
   
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
  
    if (loading) {
      return (
        <div className='loading'>
          <motion.i className="fas fa-gear" animate={{ rotate: [0, 360], transition: { duration: 1, repeat: Infinity } }}></motion.i> 
        </div>
      )
    }

    return (
      <ThemeProvider theme={theme}>
            <Router>
                {loggedIn && ( // Render logout button only if logged in
                  <div className="logout-button" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                  </div>
                )}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
                  <Route path="/" element={<Home userDetails={userDetails} />} />
                </Route>
              </Routes>
            </Router>
      </ThemeProvider>
    );
}

export default App;
