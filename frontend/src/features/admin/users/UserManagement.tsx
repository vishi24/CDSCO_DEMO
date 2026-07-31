import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Alert,
  Chip
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface User {
  id: string;
  keycloakUserId: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/auth/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch system users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
          User Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
          Manage access, roles, and status of all DDRS platform users.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Chip label="Active" size="small" color="success" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                    ) : (
                      <Chip label="Inactive" size="small" color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    {dayjs(user.createdAt).format('MMM DD, YYYY')}
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
