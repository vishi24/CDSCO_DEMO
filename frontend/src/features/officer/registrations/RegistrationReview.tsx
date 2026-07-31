import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Chip, useTheme, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';
import axios from 'axios';

const RegistrationReview: React.FC = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [comments, setComments] = useState('');

  const fetchPendingOrgs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/organizations/pending');
      setRows(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrgs();
  }, []);

  const handleActionClick = (org: any, type: 'APPROVE' | 'REJECT') => {
    setSelectedOrg(org);
    setActionType(type);
    setComments('');
    setOpenDialog(true);
  };

  const submitAction = async () => {
    if (!selectedOrg) return;
    try {
      const endpoint = actionType === 'APPROVE' 
        ? `/api/v1/organizations/${selectedOrg.id}/approve`
        : `/api/v1/organizations/${selectedOrg.id}/reject`;
        
      await axios.post(endpoint, { comments });
      setOpenDialog(false);
      fetchPendingOrgs(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  // Removed GridColDef columns

  return (
    <Box sx={{ p: 4, pt: 10, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
        Pending Registrations
      </Typography>
      
      <TableContainer component={Paper} elevation={3} sx={{ mt: 3, width: '100%', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Organization Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No pending registrations found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row: any) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.orgCode}</TableCell>
                    <TableCell>{row.orgName}</TableCell>
                    <TableCell>{row.orgType}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.stateCode}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color="warning" size="small" />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button size="small" color="success" onClick={() => handleActionClick(row, 'APPROVE')} sx={{ mr: 1 }}>Approve</Button>
                        <Button size="small" color="error" onClick={() => handleActionClick(row, 'REJECT')}>Reject</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Action Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'APPROVE' ? 'Approve Organization' : 'Reject Organization'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are about to {actionType?.toLowerCase()} the registration for <strong>{selectedOrg?.orgName}</strong>.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Officer Comments"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={submitAction} color={actionType === 'APPROVE' ? 'success' : 'error'} variant="contained">
            Confirm {actionType}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegistrationReview;
