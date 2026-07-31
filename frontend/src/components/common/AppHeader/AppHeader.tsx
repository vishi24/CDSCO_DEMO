import React from 'react';
import { Box, AppBar, Toolbar, Typography, Stack, Button, Avatar } from '@mui/material';
import { NotificationBell } from '../NotificationBell/NotificationBell';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../app/store';

// Assuming we had a logout action, we'd import it. 
// For this demo, we'll just reload or navigate to /login and clear token.
export const AppHeader: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box sx={{
            width: 32, height: 32, borderRadius: 1.5, bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: 8 }}>CDSCO</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>DDRS Portal</Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', ml: 4, flexGrow: 1 }}>
          {role === 'CDSCO_OFFICER' && (
            <>
              <Button color="inherit" onClick={() => navigate('/officer/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/officer/registrations')}>Registrations</Button>
              <Button color="inherit" onClick={() => navigate('/officer/applications')}>Applications</Button>
            </>
          )}
          {role === 'INDUSTRY' && (
            <>
              <Button color="inherit" onClick={() => navigate('/industry/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/industry/applications')}>Applications</Button>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => navigate('/admin/users')}>Users</Button>
            </>
          )}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <NotificationBell />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, pl: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{role}</Typography>
            </Box>
            <Button size="small" variant="outlined" color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
              Logout
            </Button>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
