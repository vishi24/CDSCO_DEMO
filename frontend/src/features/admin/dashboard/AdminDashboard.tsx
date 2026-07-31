import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/dashboard/admin')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const registryData = stats ? Object.entries(stats.registryCount).map(([name, value]) => ({ name, value })) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 4 }}>
          System Administration Dashboard
        </Typography>
        
        {stats ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Registered Users</Typography>
                  <Typography variant="h3">{stats.totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Active Organizations</Typography>
                  <Typography variant="h3">{stats.activeOrganizations}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" sx={{ borderRadius: 2 }} onClick={() => navigate('/admin/master-data')}>
                      Manage Master Data
                    </Button>
                    <Button variant="contained" color="info" sx={{ borderRadius: 2 }} onClick={() => navigate('/admin/users')}>
                      User Management
                    </Button>
                    <Button variant="contained" color="secondary" sx={{ borderRadius: 2 }} onClick={() => navigate('/admin/audit')}>
                      View Audit Logs
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>System Health</Typography>
                  <Typography variant="h3" color="success.main">{stats.systemHealth}</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>National Registry Distribution</Typography>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={registryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                        {registryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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

export default AdminDashboard;
