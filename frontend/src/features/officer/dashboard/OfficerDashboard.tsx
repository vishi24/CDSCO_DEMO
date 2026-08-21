import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, useTheme, CircularProgress } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend
} from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessIcon from '@mui/icons-material/Business';

export const OfficerDashboard: React.FC = () => {
  const theme = useTheme();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/organizations'),
      axios.get('/api/v1/applications')
    ])
    .then(([orgRes, appRes]) => {
      setOrganizations(orgRes.data);
      setApplications(appRes.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const data = useMemo(() => {
    if (!organizations.length || !applications.length) return null;

    // Join App -> Org to get state
    const orgMap = new Map(organizations.map(o => [o.id, o]));
    const enrichedApps = applications.map(app => ({
      ...app,
      state: orgMap.get(app.organizationId)?.stateCode || 'Unknown'
    }));

    // KPI Metrics
    const totalApps = enrichedApps.length;
    const pendingApps = enrichedApps.filter(a => ['SUBMITTED', 'SCRUTINY', 'QUERY_RAISED'].includes(a.currentStatus)).length;
    const approvedApps = enrichedApps.filter(a => ['APPROVED', 'CERTIFICATE_ISSUED'].includes(a.currentStatus)).length;
    const totalOrgs = organizations.length;

    // Apps by Status
    const statusMap = enrichedApps.reduce((acc, app) => {
      acc[app.currentStatus] = (acc[app.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // Apps by Type
    const typeMap = enrichedApps.reduce((acc, app) => {
      acc[app.licenceType] = (acc[app.licenceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    // State Grouping
    const stateMap = enrichedApps.reduce((acc, app) => {
      if (!acc[app.state]) {
        acc[app.state] = { 
          state: app.state, 
          total: 0,
          MANUFACTURING: 0, DRUG_IMPORT: 0, MEDICAL_DEVICE: 0, CLINICAL_TRIAL: 0,
          APPROVED: 0, PENDING: 0, REJECTED: 0, OTHER: 0
        };
      }
      acc[app.state].total += 1;
      
      // Type breakdown
      if (acc[app.state][app.licenceType] !== undefined) {
        acc[app.state][app.licenceType] += 1;
      }
      
      // Status breakdown
      if (['APPROVED', 'CERTIFICATE_ISSUED'].includes(app.currentStatus)) {
        acc[app.state].APPROVED += 1;
      } else if (['SUBMITTED', 'SCRUTINY', 'QUERY_RAISED'].includes(app.currentStatus)) {
        acc[app.state].PENDING += 1;
      } else if (app.currentStatus === 'REJECTED') {
        acc[app.state].REJECTED += 1;
      } else {
        acc[app.state].OTHER += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    const stateData = Object.values(stateMap).sort((a: any, b: any) => b.total - a.total).slice(0, 20); // Top 20

    return { totalApps, pendingApps, approvedApps, totalOrgs, statusData, typeData, stateData };
  }, [organizations, applications]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6b6b', '#1dd1a1'];

  const renderKpiCard = (title: string, value: string | number, icon: any, gradient: string) => (
    <Card sx={{ 
      borderRadius: 3, background: gradient, color: '#fff', 
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', position: 'relative', overflow: 'hidden', height: '100%'
    }}>
      <CardContent sx={{ p: 4, zIndex: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500, mb: 1 }}>{title}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{value}</Typography>
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: 2, display: 'flex' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
      <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}/>
    </Card>
  );

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography>Aggregating complex dashboard metrics...</Typography>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4, pb: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            CDSCO Officer Analytics
          </Typography>
        </Box>
        
        {/* KPI Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {renderKpiCard('Total Applications', data.totalApps, <AssignmentIcon fontSize="large" />, 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {renderKpiCard('Pending Action', data.pendingApps, <PendingActionsIcon fontSize="large" />, 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {renderKpiCard('Approved', data.approvedApps, <CheckCircleIcon fontSize="large" />, 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {renderKpiCard('Registered Orgs', data.totalOrgs, <BusinessIcon fontSize="large" />, 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)')}
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={4} sx={{ borderRadius: 3, height: 450 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  Application Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={data.statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" label>
                      {data.statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={4} sx={{ borderRadius: 3, height: 450 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                  Application Types Breakup
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={data.typeData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
                      {data.typeData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12 }}>
            <Card elevation={4} sx={{ borderRadius: 3, height: 500 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
                  Application Types Across States (Top 20)
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={data.stateData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="state" angle={-45} textAnchor="end" tick={{ fill: theme.palette.text.secondary }} interval={0} />
                    <YAxis />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8 }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="MANUFACTURING" stackId="a" fill="#0088FE" />
                    <Bar dataKey="DRUG_IMPORT" stackId="a" fill="#00C49F" />
                    <Bar dataKey="MEDICAL_DEVICE" stackId="a" fill="#FFBB28" />
                    <Bar dataKey="CLINICAL_TRIAL" stackId="a" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Row 3 */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Card elevation={4} sx={{ borderRadius: 3, height: 500 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
                  Processing Status Across States (Top 20)
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={data.stateData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="state" angle={-45} textAnchor="end" tick={{ fill: theme.palette.text.secondary }} interval={0} />
                    <YAxis />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8 }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="APPROVED" stackId="b" fill="#1dd1a1" />
                    <Bar dataKey="PENDING" stackId="b" fill="#feca57" />
                    <Bar dataKey="REJECTED" stackId="b" fill="#ff6b6b" />
                    <Bar dataKey="OTHER" stackId="b" fill="#c8d6e5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </motion.div>
  );
};

export default OfficerDashboard;
