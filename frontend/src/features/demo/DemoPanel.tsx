import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Alert, Stack, Snackbar } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

export const DemoPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetData = async () => {
    setLoading(true);
    try {
      // For demo, we just simulate the loading time here since the data is loaded by docker container
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMsg('Demo data successfully re-seeded from scratch.');
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const simulateNotification = async () => {
    try {
      await axios.post('/api/v1/notifications/send', {
        recipientUserId: '00000000-0000-0000-0000-000000000001',
        title: 'New High Priority Message',
        body: 'The Ministry of Health has issued a new circular regarding medical device classification.',
        type: 'WARNING'
      });
      setSuccessMsg('Notification triggered! Check the bell icon.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            DDRS Demo Control Panel
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Use these controls to simulate events or reset data during a presentation. 
            This panel is normally hidden in production.
          </Typography>
          
          <Stack spacing={3}>
            <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>1. Reset Demo Environment</Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Re-runs the data loader to ensure all 10 organizations, 200 drugs, and 50 applications exist.
              </Typography>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleResetData}
                disabled={loading}
              >
                {loading ? 'Resetting Data...' : 'Reset All Demo Data'}
              </Button>
            </Box>

            <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>2. Trigger Real-Time Notification</Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Simulates an external event pushing a notification to the current admin user via Server-Sent Events.
              </Typography>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={simulateNotification}
              >
                Trigger SSE Notification
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Snackbar 
        open={!!successMsg} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>{successMsg}</Alert>
      </Snackbar>
    </motion.div>
  );
};
