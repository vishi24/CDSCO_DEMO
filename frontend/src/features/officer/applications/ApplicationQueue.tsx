import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ApplicationQueue: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'info';
      case 'SCRUTINY': return 'warning';
      case 'QUERY_RAISED': return 'error';
      case 'TECHNICAL_REVIEW': return 'secondary';
      default: return 'default';
    }
  };

  // Removed GridColDef columns

  const [rows] = useState([
    { id: '1', applicationNumber: 'APP-1721012300', orgName: 'Sun Pharmaceuticals Ltd', licenceType: 'MEDICAL_DEVICE', currentStatus: 'SUBMITTED', slaDays: 2 },
    { id: '2', applicationNumber: 'APP-1721018900', orgName: 'Cipla India Pvt Ltd', licenceType: 'DRUG_MANUFACTURING', currentStatus: 'SCRUTINY', slaDays: 5 },
  ]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 3 }}>Application Queue</Typography>
      
      <TableContainer component={Card} sx={{ width: '100%', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600 }}>Application No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Applicant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>SLA (Days left)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No applications found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row: any) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.applicationNumber}</TableCell>
                  <TableCell>{row.orgName}</TableCell>
                  <TableCell>{row.licenceType}</TableCell>
                  <TableCell>
                    <Chip label={row.currentStatus} color={getStatusColor(row.currentStatus) as any} size="small" />
                  </TableCell>
                  <TableCell>{row.slaDays}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary" onClick={() => navigate(`/officer/applications/${row.id}`)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
