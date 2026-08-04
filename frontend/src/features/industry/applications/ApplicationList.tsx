import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Drawer,
  IconButton, Alert, Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import TimelineIcon from '@mui/icons-material/Timeline';
import axios from 'axios';
import { ApplicantStatusDashboard } from './ApplicantStatusDashboard';
import { ApplicationTimeline } from './ApplicationTimeline';

const STATUS_ORDER = ['DRAFT', 'SUBMITTED', 'SCRUTINY', 'QUERY_RAISED',
  'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'APPROVED', 'REJECTED'];

const getStatusColor = (status: string): any => {
  switch (status) {
    case 'DRAFT': return 'default';
    case 'SUBMITTED': return 'info';
    case 'SCRUTINY':
    case 'INSPECTION_SCHEDULED':
    case 'INSPECTION_COMPLETED': return 'warning';
    case 'QUERY_RAISED': return 'error';
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

export const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as any)?.message;
  const { organizationId, token } = useSelector((state: RootState) => state.auth);

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineApp, setTimelineApp] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Use the organizationId from JWT if available, fall back to fetching all
    const orgId = organizationId || '';
    const url = orgId
      ? `/api/v1/applications?organizationId=${orgId}`
      : `/api/v1/applications`;
    axios.get(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(res => setRows(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [organizationId, token]);

  const openTimeline = async (row: any) => {
    setTimelineApp(row);
    // Build synthetic timeline from status order
    const statusIdx = STATUS_ORDER.indexOf(row.currentStatus);
    const events = STATUS_ORDER.slice(0, statusIdx + 1).map((s, i) => ({
      status: s.replace(/_/g, ' '),
      date: i === statusIdx
        ? new Date(row.updatedAt || row.applicationDate).toLocaleString('en-IN')
        : new Date(new Date(row.applicationDate).getTime() + i * 86400000 * 2).toLocaleDateString('en-IN'),
      description: getStatusDescription(s, row),
      completed: true
    }));
    // Append pending steps
    STATUS_ORDER.slice(statusIdx + 1).forEach(s => {
      if (s !== 'REJECTED') {
        events.push({ status: s.replace(/_/g, ' '), date: 'Pending', description: 'Awaiting action', completed: false });
      }
    });
    setTimelineEvents(events);
    setDrawerOpen(true);
  };

  const getStatusDescription = (status: string, row: any): string => {
    switch (status) {
      case 'DRAFT': return 'Application created as draft';
      case 'SUBMITTED': return `Submitted. ARN: ${row.arnNumber || row.applicationNumber}`;
      case 'SCRUTINY': return 'Document scrutiny in progress by CDSCO officer';
      case 'QUERY_RAISED': return 'Deficiency raised. Please respond before deadline';
      case 'INSPECTION_SCHEDULED': return 'Site inspection has been scheduled';
      case 'INSPECTION_COMPLETED': return 'Inspection completed. Awaiting decision';
      case 'APPROVED': return `Approved! Licence issued: RC/CDSCO/${new Date().getFullYear()}/XXXXX`;
      case 'REJECTED': return 'Application rejected. See rejection reason for details';
      default: return '';
    }
  };

  const handleDownloadArn = (row: any) => {
    const arn = row.arnNumber || row.applicationNumber;
    const content = `ARN RECEIPT\n\nApplication Reference Number: ${arn}\nDrug: ${row.genericName || row.drugName || 'N/A'}\nCase Type: ${row.caseType || 'N/A'}\nSubmitted: ${new Date(row.applicationDate).toLocaleDateString('en-IN')}\nStatus: ${row.currentStatus}\n\nCDSCO — Digital Drugs Regulatory System`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${arn}-receipt.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCertificate = (row: any) => {
    const content = `MANUFACTURING LICENCE CERTIFICATE\n\nRC No.: RC/CDSCO/${new Date().getFullYear()}/XXXXX\nDrug: ${row.genericName || row.drugName}\nGranted to: Demo Pharmaceuticals Ltd.\nValid Until: ${new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('en-IN')}\n\nIssued under the Drugs and Cosmetics Act, 1940\nCDSCO, Government of India`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `licence-certificate-${row.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 4 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => window.history.replaceState({}, '')}>
          {successMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" color="primary"  sx={{ fontWeight: 600 }}>My Applications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/industry/applications/new')}>
          New Application
        </Button>
      </Box>

      {/* Status Dashboard Cards */}
      {!loading && rows.length > 0 && (
        <ApplicantStatusDashboard applications={rows.slice(0, 4).map(r => ({
          id: r.id,
          applicationNumber: r.arnNumber || r.applicationNumber,
          drugName: r.genericName || r.drugName || 'N/A',
          status: r.currentStatus,
          submittedAt: new Date(r.applicationDate).toLocaleDateString('en-IN')
        }))} />
      )}

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>All Applications</Typography>

      <TableContainer component={Card} sx={{ width: '100%', borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>ARN / Ref. No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Drug (Generic Name)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Case Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No applications found. Click "New Application" to get started.</Typography>
                  </TableCell>
                </TableRow>
              ) : rows.map((row: any) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2"  color="primary" sx={{ fontWeight: 600 }}>
                      {row.arnNumber || row.applicationNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.genericName || row.drugName || '—'}</Typography>
                    {row.brandName && (
                      <Typography variant="caption" color="textSecondary">{row.brandName}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {(row.drugCategory || row.subCategory || row.licenceType || '—').replace(/_/g, ' ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.caseType || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(row.applicationDate).toLocaleDateString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.currentStatus.replace(/_/g, ' ')}
                      color={getStatusColor(row.currentStatus)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Timeline">
                        <IconButton size="small" color="primary" onClick={() => openTimeline(row)}>
                          <TimelineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download ARN Receipt">
                        <IconButton size="small" color="default" onClick={() => handleDownloadArn(row)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {row.currentStatus === 'APPROVED' && (
                        <Tooltip title="Download Licence Certificate">
                          <IconButton size="small" color="success" onClick={() => handleDownloadCertificate(row)}>
                            <VerifiedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Timeline Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 420, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Application Journey
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          {timelineApp && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                ARN: <strong>{timelineApp.arnNumber || timelineApp.applicationNumber}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drug: <strong>{timelineApp.genericName || timelineApp.drugName || 'N/A'}</strong>
              </Typography>
            </Box>
          )}
          <ApplicationTimeline events={timelineEvents} currentStatus={timelineApp?.currentStatus} />
        </Box>
      </Drawer>
    </Box>
  );
};
