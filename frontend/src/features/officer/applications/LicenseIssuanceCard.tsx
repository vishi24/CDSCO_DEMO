import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';

interface LicenseIssuanceCardProps {
  applicationNumber: string;
  organizationName: string;
  licenceNumber: string;
  validUntil: string;
  drugName: string;
}

export const LicenseIssuanceCard: React.FC<LicenseIssuanceCardProps> = ({
  applicationNumber,
  organizationName,
  licenceNumber,
  validUntil,
  drugName
}) => {
  return (
    <Paper sx={{ p: 4, border: '2px solid #1976d2', borderRadius: 2, background: '#f8fbff' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Manufacturing Licence</Typography>
          <Typography variant="subtitle2" color="textSecondary">Government of India (CDSCO)</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #ccc', borderRadius: 1, bgcolor: '#fff' }}>
          <QrCode2Icon sx={{ fontSize: 60, color: '#333' }} />
          <Typography variant="caption" sx={{ display: 'block' }}>Scan to Verify</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="textSecondary">Licence Number</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{licenceNumber}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="textSecondary">Valid Until</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{validUntil}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="textSecondary">Licensee (Organization)</Typography>
          <Typography variant="body1">{organizationName}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="textSecondary">Approved Product</Typography>
          <Typography variant="body1">{drugName}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="textSecondary">Ref. Application No.</Typography>
          <Typography variant="body2">{applicationNumber}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #ccc', textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          This is a digitally signed certificate. No physical signature is required.
        </Typography>
      </Box>
    </Paper>
  );
};
