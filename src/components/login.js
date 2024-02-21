import React, { useState } from 'react';
import Navbar from './navbar';
import { Container, Card, CardContent, TextField, Button, Typography, Link } from '@mui/material';
import { authenticateUser } from '../api/loginApi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userInfo, setUserInfo] = useState(null);

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await authenticateUser(username, password);
      console.log("this is the response : "+JSON.stringify(response, null, 2));
  
      const userData = {
        username: response.username,
        email: response.email,
        number: response.id,
        accessToken: response.accessToken,
        roles: response.roles // Include roles in the userData object
      };
  
      // Save user data in session storage after stringifying
      sessionStorage.setItem('user', JSON.stringify((userData)));
      sessionStorage.setItem('role', JSON.parse(sessionStorage.getItem('user')).roles)
      sessionStorage.setItem('accessToken', JSON.parse(sessionStorage.getItem('user')).accessToken)
      sessionStorage.setItem('request',"login")
      console.log("this is the response of the login : " + userData)
      // Set the isLoggedIn state to true
      setIsLoggedIn(true);
    
      // Set the userInfo state
      setUserInfo(userData);
    
      // Redirect to home page
      window.location.href = '/home';
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid username or password');
    }
  };
  
  
  

  return (
    <>
<Navbar isLoggedIn={isLoggedIn} userInfo={userInfo || {}} />
      <Container maxWidth="sm" className="login-container">
        <Card>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            {error && <Typography variant="body2" align="center" color="error">{error}</Typography>}
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
              Don't have an account? <Link href="#">Create your account here!</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Login;
