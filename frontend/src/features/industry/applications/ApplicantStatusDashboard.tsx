import React from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';

interface ApplicationStatus {
  id: string;
  applicationNumber: string;
  drugName: string;
  status: string;
  submittedAt: string;
}

interface DashboardProps {
  applications: ApplicationStatus[];
}

export const ApplicantStatusDashboard: React.FC<DashboardProps> = ({ applications }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'QUERY_RAISED': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>My Applications Dashboard</Typography>
      <Grid container spacing={3}>
        {applications.map((app) => (
          <Grid size={{ xs: 12, md: 6 }} key={app.id}>
            <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1, borderLeft: '4px solid', borderColor: `${getStatusColor(app.status)}.main` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1"  sx={{ fontWeight: 'bold' }}>{app.applicationNumber}</Typography>
                <Chip label={app.status.replace('_', ' ')} color={getStatusColor(app.status) as any} size="small" />
              </Box>
              <Typography variant="body2" color="textSecondary">Drug: {app.drugName}</Typography>
              <Typography variant="caption" color="textSecondary">Submitted on: {app.submittedAt}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
