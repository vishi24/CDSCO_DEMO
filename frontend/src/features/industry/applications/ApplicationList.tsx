import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

export const ApplicationList: React.FC = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SUBMITTED': return 'info';
      case 'SCRUTINY': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  // Removed GridColDef columns

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    axios.get('/api/v1/applications?organizationId=00000000-0000-0000-0000-000000000001')
      .then(res => setRows(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>My Applications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/industry/applications/new')}>
          New Application
        </Button>
      </Box>

      <TableContainer component={Card} sx={{ width: '100%', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Application No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Licence Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No applications found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row: any) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.applicationNumber}</TableCell>
                    <TableCell>{row.licenceType}</TableCell>
                    <TableCell>{new Date(row.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={row.currentStatus} color={getStatusColor(row.currentStatus) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/industry/applications/${row.id}`)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};
