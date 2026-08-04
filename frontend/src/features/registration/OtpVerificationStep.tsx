import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Alert } from '@mui/material';
import axios from 'axios';

interface OtpVerificationStepProps {
  mobile: string;
  email: string;
  onVerified: () => void;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({ mobile, email, onVerified }) => {
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  
  const [mobileTimer, setMobileTimer] = useState(300); // 5 mins
  const [emailTimer, setEmailTimer] = useState(900); // 15 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mobileVerified && emailVerified) {
      onVerified();
    }
  }, [mobileVerified, emailVerified, onVerified]);

  const handleOtpChange = (
    value: string,
    index: number,
    type: 'mobile' | 'email'
  ) => {
    if (!/^\d*$/.test(value)) return;
    
    const setOtp = type === 'mobile' ? setMobileOtp : setEmailOtp;
    const currentOtp = type === 'mobile' ? [...mobileOtp] : [...emailOtp];
    
    currentOtp[index] = value;
    setOtp(currentOtp);

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`${type}-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (type: 'mobile' | 'email') => {
    const otpValue = (type === 'mobile' ? mobileOtp : emailOtp).join('');
    const target = type === 'mobile' ? mobile : email;
    
    try {
      const res = await axios.post('/api/v1/auth/otp/verify', { target, otp: otpValue, type });
      if (res.data.verified) {
        if (type === 'mobile') setMobileVerified(true);
        else setEmailVerified(true);
      } else {
        alert('Invalid OTP');
      }
    } catch (e) {
      console.error(e);
      alert('Error verifying OTP');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 4 }}>
        Demo Hint: Use Mobile OTP: <strong>123456</strong> | Email OTP: <strong>654321</strong>
      </Alert>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Mobile OTP</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Sent to: +91 {mobile.replace(/.(?=.{4})/g, 'x')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {mobileOtp.map((digit, i) => (
                <TextField
                  key={i}
                  id={`mobile-otp-${i}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i, 'mobile')}
                  slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
                  disabled={mobileVerified}
                  sx={{ width: 45 }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                onClick={() => handleVerify('mobile')}
                disabled={mobileVerified || mobileOtp.join('').length !== 6}
                color={mobileVerified ? "success" : "primary"}
              >
                {mobileVerified ? 'Verified' : 'Verify'}
              </Button>
              <Typography variant="caption" color={mobileTimer === 0 ? "error" : "textSecondary"}>
                {mobileTimer > 0 ? formatTime(mobileTimer) : 'Expired'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Email OTP</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Sent to: {email.replace(/(.{2})(.*)(?=@)/, '$1***')}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {emailOtp.map((digit, i) => (
                <TextField
                  key={i}
                  id={`email-otp-${i}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i, 'email')}
                  slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: 'center' } } }}
                  disabled={emailVerified}
                  sx={{ width: 45 }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                onClick={() => handleVerify('email')}
                disabled={emailVerified || emailOtp.join('').length !== 6}
                color={emailVerified ? "success" : "primary"}
              >
                {emailVerified ? 'Verified' : 'Verify'}
              </Button>
              <Typography variant="caption" color={emailTimer === 0 ? "error" : "textSecondary"}>
                {emailTimer > 0 ? formatTime(emailTimer) : 'Expired'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
