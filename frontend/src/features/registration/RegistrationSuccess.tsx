import React from 'react';
import { Box, Typography, Button, Paper, useTheme, Alert, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';

const RegistrationSuccess: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const ddrsUserId = state?.ddrsUserId
    || `DDRS/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 90000000) + 10000000).padStart(8, '0')}`;
  const orgCode = state?.orgCode || 'ORG-XXXXX';

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
      background: 'linear-gradient(135deg, #0A1E3F 0%, #1A3C6E 55%, #2563EB 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Paper elevation={8} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <CheckCircleOutlinedIcon sx={{ fontSize: 88, color: theme.palette.success.main, mb: 2 }} />
          </motion.div>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Registration Successful!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Your organization has been registered on the DDRS portal. A CDSCO officer will review
            and activate your account within 2 working days.
          </Typography>

          {/* DDRS User ID */}
          <Box sx={{ bgcolor: '#e8f5e9', p: 3, borderRadius: 2, mb: 3, border: '1px solid #a5d6a7' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Your DDRS User ID
            </Typography>
            <Typography variant="h5" color="success.dark" sx={{ letterSpacing: 2, fontWeight: 700 }}>
              {ddrsUserId}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Please save this ID. You will need it for all future correspondence with CDSCO.
            </Typography>
          </Box>

          {/* Org Code */}
          {orgCode !== 'ORG-XXXXX' && (
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="caption" color="textSecondary">Temporary Organization Code</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>{orgCode}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Fake Notification Banner */}
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Notifications Sent:</Typography>
            <Alert icon={<SmsIcon />} severity="success" sx={{ mb: 1 }}>
              SMS sent to your registered mobile: <em>"Welcome to DDRS! Your User ID: {ddrsUserId}"</em>
            </Alert>
            <Alert icon={<EmailIcon />} severity="success">
              Email sent to your registered email address with login credentials and next steps.
            </Alert>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained" size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})` }}
            >
              Login to DDRS Portal
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </Box>

          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3 }}>
            © {new Date().getFullYear()} CDSCO, Government of India. All rights reserved.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RegistrationSuccess;
