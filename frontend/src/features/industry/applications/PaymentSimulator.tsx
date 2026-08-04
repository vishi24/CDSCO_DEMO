import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

interface PaymentSimulatorProps {
  amount: number;
  onSuccess: (utr: string) => void;
}

export const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({ amount, onSuccess }) => {
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [utr, setUtr] = useState('');

  const handlePay = () => {
    setStatus('PROCESSING');
    
    // Simulate API delay
    setTimeout(() => {
      const generatedUtr = `BK${new Date().getFullYear()}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
      setUtr(generatedUtr);
      setStatus('SUCCESS');
    }, 2000);
  };

  useEffect(() => {
    if (status === 'SUCCESS' && utr) {
      setTimeout(() => {
        onSuccess(utr);
      }, 1500); // Wait a bit so user can see success message
    }
  }, [status, utr, onSuccess]);

  return (
    <Box sx={{ p: 4, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
      <Typography variant="h6" gutterBottom>NTRP Payment Gateway Simulator</Typography>
      
      <Box sx={{ my: 3 }}>
        <Typography variant="h3" color="primary">₹ {amount.toLocaleString('en-IN')}</Typography>
        <Typography variant="caption" color="textSecondary">Total Amount Payable</Typography>
      </Box>

      {status === 'IDLE' && (
        <Button variant="contained" color="primary" size="large" onClick={handlePay}>
          Pay Now
        </Button>
      )}

      {status === 'PROCESSING' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography>Processing payment... please do not refresh.</Typography>
        </Box>
      )}

      {status === 'SUCCESS' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment Successful! UTR: {utr}
        </Alert>
      )}
    </Box>
  );
};
