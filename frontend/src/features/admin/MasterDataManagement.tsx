import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, Tooltip, CircularProgress, Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

interface MasterData {
  id: string;
  category: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export const MasterDataManagement: React.FC = () => {
  const [data, setData] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    code: '',
    name: '',
    description: '',
    isActive: true
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/v1/admin/master-data');
      setData(response.data);
    } catch (err: any) {
      setError('Failed to fetch master data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (item?: MasterData) => {
    if (item) {
      setIsEditing(true);
      setCurrentId(item.id);
      setFormData({
        category: item.category,
        code: item.code,
        name: item.name,
        description: item.description,
        isActive: item.isActive
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        category: 'DRUG_TYPE',
        code: '',
        name: '',
        description: '',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await axios.put(`/api/v1/admin/master-data/${currentId}`, formData);
      } else {
        await axios.post('/api/v1/admin/master-data', formData);
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.error('Failed to save', err);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
              Master Data Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Manage system-wide configuration, categories, and lookup tables.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            Add Record
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Chip label={row.category} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {row.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.description}</Typography>
                  </TableCell>
                  <TableCell>
                    {row.isActive ? (
                      <Chip icon={<CheckCircleIcon />} label="Active" size="small" color="success" sx={{ bgcolor: '#dcfce7', color: '#166534' }} />
                    ) : (
                      <Chip icon={<CancelIcon />} label="Inactive" size="small" color="error" sx={{ bgcolor: '#fee2e2', color: '#991b1b' }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleOpen(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create/Edit Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {isEditing ? 'Edit Master Data' : 'Add Master Data'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isEditing} // usually category shouldn't change
                >
                  <MenuItem value="DRUG_TYPE">Drug Type (DRUG_TYPE)</MenuItem>
                  <MenuItem value="DEVICE_CLASS">Device Class (DEVICE_CLASS)</MenuItem>
                  <MenuItem value="ORGANIZATION_TYPE">Organization Type (ORGANIZATION_TYPE)</MenuItem>
                  <MenuItem value="DOCUMENT_TYPE">Document Type (DOCUMENT_TYPE)</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal" fullWidth label="Code" required
                value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                disabled={isEditing}
                helperText="Unique identifier code without spaces (e.g., VACCINE)"
              />
              
              <TextField
                margin="normal" fullWidth label="Display Name" required
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              
              <TextField
                margin="normal" fullWidth label="Description" multiline rows={2}
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              
              {isEditing && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.isActive ? 'true' : 'false'}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, px: 3 }}>
              <Button onClick={handleClose} color="inherit">Cancel</Button>
              <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 2 }}>
                {isEditing ? 'Save Changes' : 'Create Record'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </motion.div>
  );
};
