import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

export const OfficerDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/v1/dashboard/officer')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = stats ? Object.entries(stats.applicationsByState).map(([state, count]) => ({ state, count })) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
          CDSCO Officer Dashboard
        </Typography>
        
        {stats ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Queue Size</Typography>
                  <Typography variant="h3" color="warning.main">{stats.queueSize}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Processed Today</Typography>
                  <Typography variant="h3" color="success.main">{stats.processedToday}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Pending Registrations</Typography>
                  <Typography variant="h3">{stats.pendingRegistrations}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Card elevation={2} sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Applications by State</Typography>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="state" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B35" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Loading dashboard data...</Box>
        )}
      </Box>
    </motion.div>
  );
};

export default OfficerDashboard;
