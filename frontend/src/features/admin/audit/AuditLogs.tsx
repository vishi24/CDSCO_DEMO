import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert,
  Chip
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string | null;
  action: string;
  userRole: string;
  performedBy: string | null;
  performedAt: string;
  details: string;
  ipAddress: string | null;
}

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/v1/audit');
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED')) return 'success';
    if (action.includes('REJECTED') || action.includes('ERROR')) return 'error';
    if (action.includes('REGISTERED') || action.includes('SUBMITTED')) return 'info';
    return 'default';
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
          System Audit Logs
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
          Immutable trail of all significant actions across the DDRS platform.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Entity</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {dayjs(log.performedAt).format('DD MMM YYYY, HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <Chip label={log.entityType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={log.action} size="small" color={getActionColor(log.action) as any} />
                  </TableCell>
                  <TableCell>
                    {log.userRole}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
};
