import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  useMediaQuery,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '@fontsource/montserrat';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const Header = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ fontWeight: 'bold', color: 'primary.main', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Blockfund
        </Typography>
        {isMobile ? (
          <IconButton edge="end" color="inherit">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box>
            {user ? (
              <>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {user.full_name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Sign up
                </Button>
                
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

const Hero = () => (
  <Box
    sx={{
      py: { xs: 6, md: 12 },
      textAlign: 'center',
      bgcolor: 'background.paper',
      backgroundImage: 'url("https://images.unsplash.com/photo-1731569348001-e49c36947289?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      position: 'relative',
      zIndex: 1,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: -1,
      }
    }}
  >
    <Container maxWidth="md">
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
        Innovation in Transparency
      </Typography>
      <Typography variant="h6" paragraph>
        Blockfund is a next-generation crowdfunding platform built on transparency,
        trust, and technology. Our mission is simple: to empower individuals,
        organizations, and communities to raise and manage funds with complete
        accountability.
      </Typography>
      <Button variant="contained" size="large" sx={{ mt: 3 }}>
        Join Now
      </Button>
    </Container>
  </Box>
);

const Features = () => (
  <Box sx={{ py: 10, bgcolor: 'grey.100' }}>
    <Container>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
        Why Blockfund?
      </Typography>
      <Typography variant="h6" paragraph>
        Powered by blockchain technology, Blockfund ensures that every transaction is secure,
        traceable, and tamper-proof, eliminating the doubts that often surround traditional
        fundraising platforms. Whether you're supporting a social cause, launching a startup, or
        funding a community project, Blockfund guarantees 100% visibility into how funds are
        collected, allocated, and utilized. At Blockfund, we believe that transparency is the
        currency of trust. Our platform provides real-time tracking of donations, automated
        reports, and decentralized verification — giving backers the confidence to contribute and
        project creators the tools to build credibility. Join us in reshaping the future of
        fundraising — where every rupee, dollar, or token raised is accounted for, and impact is
        not just promised but proven
      </Typography>
    </Container>
  </Box>
);

const Footer = () => (
  <Box sx={{ py: 5, textAlign: 'center', bgcolor: 'grey.200', mt: 6 }}>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Blockfund. All rights reserved.
    </Typography>
  </Box>
);

const Home = () => (
  <>
    <Hero />
    <Features />
  </>
);

const Dashboard = () => (
  <Container>
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard. This is a protected route.
      </Typography>
    </Box>
  </Container>
);

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
    <Footer />
  </ThemeProvider>
);

export default App;