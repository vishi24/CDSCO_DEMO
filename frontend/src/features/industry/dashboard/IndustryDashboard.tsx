import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Divider, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import axios from 'axios';

export const IndustryDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { organizationId, email, token, ddrsUserId } = useSelector((state: RootState) => state.auth);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    axios.get('/api/v1/dashboard/industry', { headers: authHeader })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
    // Fetch user profile
    if (token) {
      axios.get('/api/v1/auth/me', { headers: authHeader })
        .then(res => setUserProfile(res.data))
        .catch(() => {});
    }
  }, [token]);

  const chartData = stats ? [
    { name: 'Pending', value: stats.pendingApplications },
    { name: 'Approved', value: stats.approvedApplications },
    { name: 'Rejected', value: stats.rejectedApplications },
  ] : [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
        Industry Dashboard
      </Typography>

      {/* User Profile Card */}
      <Card elevation={2} sx={{ mb: 4, background: 'linear-gradient(135deg, #1A3C6E 0%, #2563EB 100%)', color: 'white' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
            <PersonIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              {userProfile?.fullName || email || 'Industry User'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
              {userProfile?.userType || 'Industry'} · {email}
            </Typography>
            {(ddrsUserId || userProfile?.ddrsUserId) && (
              <Chip
                label={`DDRS ID: ${ddrsUserId || userProfile?.ddrsUserId}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
              />
            )}
          </Box>
          {organizationId && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
              <BusinessIcon />
              <Typography variant="caption">Org ID: {organizationId.slice(0,8)}...</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Applications</Typography>
                <Typography variant="h3">{stats.totalApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Active Certificates</Typography>
                <Typography variant="h3" color="success.main">{stats.activeCertificates}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending Review</Typography>
                <Typography variant="h3" color="warning.main">{stats.pendingApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Approved</Typography>
                <Typography variant="h3" color="primary.main">{stats.approvedApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Application Status Breakdown</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1A3C6E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          {userProfile && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>My Profile Details</Typography>
                <Grid container spacing={2}>
                  {[
                    ['Full Name', userProfile.fullName],
                    ['Email', userProfile.email],
                    ['Mobile', userProfile.mobile],
                    ['User Type', userProfile.userType],
                    ['Nationality', userProfile.nationality],
                    ['Qualification', userProfile.qualification],
                    ['Designation', userProfile.designation],
                    ['DDRS User ID', userProfile.ddrsUserId || ddrsUserId],
                    ['Date of Birth', userProfile.dateOfBirth],
                    ['Experience (Years)', userProfile.experienceYears?.toString()],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={label as string}>
                      <Typography variant="caption" color="textSecondary">{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{val}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {!stats && (
        <Card elevation={1} sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Loading dashboard data...</Typography>
        </Card>
      )}
    </Box>
  );
};

export default IndustryDashboard;

