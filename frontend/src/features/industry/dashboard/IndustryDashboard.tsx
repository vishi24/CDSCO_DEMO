import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export const IndustryDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // In demo, directly fetch from the proxy
    axios.get('/api/v1/dashboard/industry')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

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
                    <Bar dataKey="value" fill="#1A3C6E" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default IndustryDashboard;
