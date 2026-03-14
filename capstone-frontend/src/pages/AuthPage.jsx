import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Stack,
  Button,
  Typography,
  Alert,
} from '@mui/material';

function AuthPage() {
  const navigate = useNavigate();

  // Controls whether the auth card is showing login or register
  const [tabValue, setTabValue] = useState(0);

  // Shared form state for auth inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const featureItems = [
    'File applications by company, role, salary, and link',
    'Track each opportunity through your hiring pipeline',
    'Log calls, emails, interviews, and follow-ups',
    'Save recruiter and hiring manager contacts by company',
    'Stay on top of next steps with tasks and reminders',
  ];

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // UI feedback state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
    setError('');
    setFormData({
      email: '',
      password: '',
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const isLogin = tabValue === 0;
    const endpoint = isLogin
      ? 'http://localhost:3001/auth/login'
      : 'http://localhost:3001/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store auth data for protected requests
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % featureItems.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [featureItems.length]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          alignItems: 'center',
          gap: 4,
          py: 6,
          backgroundColor: '#fafafa',
        }}
      >
        {/* Left side: startup / intro content */}
        <Box
          sx={{
            maxWidth: 560,
            pr: { md: 2 },
          }}
        >
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              lineHeight: 1.1,
            }}
          >
            Job Application Tracker
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: 'text.secondary',
              fontWeight: 500,
              maxWidth: 520,
            }}
          >
            Organize applications, contacts, interviews, and follow-ups in one place.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gap: 2,
              alignItems: 'start',
              minHeight: 180,
            }}
          >
            {/* Vertical progress indicators */}
            <Stack
              spacing={1.2}
              sx={{
                pt: 0.5,
                alignItems: 'center',
              }}
            >
              {featureItems.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: index === activeFeatureIndex ? 28 : 8,
                    borderRadius: 999,
                    bgcolor:
                      index === activeFeatureIndex
                        ? 'primary.main'
                        : 'rgba(0,0,0,0.18)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Stack>

            {/* Active feature content */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                }}
              >
                {featureItems[activeFeatureIndex]}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  color: 'text.secondary',
                  maxWidth: 500,
                }}
              >
                Built to help you manage your search with clarity and keep every
                opportunity in one organized workspace.
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Right side: auth card */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid #eaeaea',
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Log in or create an account to manage your job search.
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading
                ? tabValue === 0
                  ? 'Logging in...'
                  : 'Registering...'
                : tabValue === 0
                  ? 'Login'
                  : 'Register'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AuthPage;
