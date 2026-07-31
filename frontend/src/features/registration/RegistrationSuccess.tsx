import React from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleOutlined } from '@mui/icons-material';

const RegistrationSuccess: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const orgCode = location.state?.orgCode || 'ORG-XXXXX';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, background: theme.palette.background.default }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center', maxWidth: 600 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <CheckCircleOutlined sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
          </motion.div>
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Registration Successful!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Your organization registration has been submitted successfully. A CDSCO officer will review your application.
          </Typography>

          <Box sx={{ bgcolor: theme.palette.grey[100], p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Your Temporary Organization Code
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1, color: theme.palette.primary.main }}>
              {orgCode}
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/')}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              px: 4
            }}
          >
            Return to Home
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RegistrationSuccess;
