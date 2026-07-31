import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from './authSlice';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, CircularProgress, Alert, Divider, Chip,
  InputAdornment, IconButton, Stack,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface DemoUser {
  email: string;
  role: string;
  label: string;
  color: 'primary' | 'warning' | 'error';
}

const DEMO_USERS: DemoUser[] = [
  { email: 'industry@example.com',  role: 'Industry',       label: 'Industry User',   color: 'primary'  },
  { email: 'officer@cdsco.gov.in',  role: 'CDSCO Officer',  label: 'CDSCO Officer',   color: 'warning'  },
  { email: 'admin@cdsco.gov.in',    role: 'Admin',          label: 'Administrator',   color: 'error'    },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const token = response.data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.realm_access?.roles?.[0] || 'INDUSTRY';
      dispatch(setCredentials({ token, role }));
      if (role === 'CDSCO_OFFICER' || role === 'CDSCO_SENIOR') navigate('/officer/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/industry/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user: DemoUser) => {
    setEmail(user.email);
    setPassword('password');
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #0A1E3F 0%, #1A3C6E 55%, #2563EB 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      {[...Array(4)].map((_, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          width: [400,300,200,150][i],
          height: [400,300,200,150][i],
          top:    ['-100px','60%','20%','50%'][i],
          left:   ['-100px','70%','-50px','85%'][i],
        }} />
      ))}

      {/* Left Panel — Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          color: 'white',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          {/* GoI Emblem placeholder */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              <SecurityIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: 2, textTransform: 'uppercase' }}>
                Government of India
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Ministry of Health & Family Welfare
              </Typography>
            </Box>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
            Digital Drugs<br />
            <Box component="span" sx={{ color: '#FF6B35' }}>Regulatory System</Box>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.75, mb: 4, maxWidth: 420, lineHeight: 1.8 }}>
            A unified platform for pharmaceutical licensing, drug registry management,
            and regulatory compliance under the Central Drugs Standard Control Organisation.
          </Typography>

          {/* Feature highlights */}
          {['End-to-end Licensing Workflow', 'Digitally Signed Certificates', '7 Integrated Registries', 'Real-time Status Tracking'].map((f) => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF6B35', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ opacity: 0.85 }}>{f}</Typography>
            </Box>
          ))}
        </motion.div>
      </Box>

      {/* Right Panel — Login Form */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: { xs: '100%', md: '45%' }, px: { xs: 2, md: 6 }, py: 4,
          position: 'relative', zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Card sx={{
            borderRadius: 4,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}>
            {/* Card header strip */}
            <Box sx={{ height: 6, background: 'linear-gradient(90deg, #1A3C6E, #FF6B35, #00B894)' }} />
            
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Welcome to DDRS
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Sign in to access the regulatory portal
                </Typography>
              </Box>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
                </motion.div>
              )}

              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  margin="normal" required fullWidth
                  id="email" label="Email Address"
                  autoComplete="email" autoFocus
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <TextField
                  margin="normal" required fullWidth
                  id="password" label="Password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                            {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
                <Button
                  type="submit" fullWidth variant="contained"
                  sx={{ mt: 3, mb: 2, height: 48, fontSize: '1rem', fontWeight: 700, borderRadius: 3 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In Securely'}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Demo Quick Access</Typography>
              </Divider>

              <Stack spacing={1}>
                {DEMO_USERS.map((u) => (
                  <Button
                    key={u.email} variant="outlined" size="small"
                    color={u.color} fullWidth
                    onClick={() => fillDemo(u)}
                    sx={{ borderRadius: 2, justifyContent: 'space-between', px: 2 }}
                  >
                    <span>{u.label}</span>
                    <Chip label={u.role} size="small" color={u.color} sx={{ height: 20, fontSize: '0.7rem' }} />
                  </Button>
                ))}
                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', display: 'block', mt: 0.5 }}>
                  All demo accounts use password: <strong>password</strong>
                </Typography>
              </Stack>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  New organization? {' '}
                  <Link to="/register" style={{ color: '#1A3C6E', fontWeight: 600 }}>
                    Register Here
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', display: 'block', mt: 3 }}>
            © 2026 CDSCO, Government of India. All rights reserved.<br />
            Powered by Digital Public Infrastructure
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};
