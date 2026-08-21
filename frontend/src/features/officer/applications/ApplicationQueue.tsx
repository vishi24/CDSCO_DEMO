import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, ToggleButtonGroup, ToggleButton,
  TextField, MenuItem, Select, FormControl, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const getStatusColor = (status: string): any => {
  switch (status) {
    case 'SUBMITTED': return 'info';
    case 'SCRUTINY': return 'warning';
    case 'INSPECTION_SCHEDULED': return 'secondary';
    case 'INSPECTION_COMPLETED': return 'secondary';
    case 'QUERY_RAISED': return 'error';
    case 'APPROVED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

const getPriority = (submittedAt: string): { label: string; color: any } => {
  if (!submittedAt) return { label: 'Normal', color: 'default' };
  const days = Math.floor((Date.now() - new Date(submittedAt).getTime()) / 86400000);
  if (days > 30) return { label: '🔴 Urgent', color: 'error' };
  if (days > 15) return { label: '🟠 High', color: 'warning' };
  return { label: '🟢 Normal', color: 'success' };
};

export const ApplicationQueue: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/applications'),
      axios.get('/api/v1/organizations')
    ])
      .then(([appRes, orgRes]) => {
        const orgMap = new Map<string, any>(orgRes.data.map((o: any) => [o.id, o]));
        const activeApps = appRes.data.filter((a: any) => a.currentStatus !== 'DRAFT').map((a: any) => ({
          ...a,
          state: orgMap.get(a.organizationId)?.stateCode || 'Unknown',
          displayCategory: (a.drugCategory || a.subCategory || a.licenceType || '—')
        }));
        setRows(activeApps);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueStates = ['ALL', ...Array.from(new Set(rows.map(r => r.state))).filter(s => s !== 'Unknown').sort()];
  const uniqueStatuses = ['ALL', ...Array.from(new Set(rows.map(r => r.currentStatus))).sort()];
  const uniqueCategories = ['ALL', ...Array.from(new Set(rows.map(r => r.displayCategory))).filter(c => c !== '—').sort()];

  const filtered = rows.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.currentStatus === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || r.displayCategory === categoryFilter;
    const matchState = stateFilter === 'ALL' || r.state === stateFilter;
    const matchSearch = !searchText ||
      r.applicationNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.arnNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.drugName?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.genericName?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchCategory && matchState && matchSearch;
  });

  const urgentCount = rows.filter(r => {
    const days = Math.floor((Date.now() - new Date(r.applicationDate).getTime()) / 86400000);
    return days > 30 && r.currentStatus !== 'APPROVED' && r.currentStatus !== 'REJECTED';
  }).length;

  const handleAssignOfficer = async (appId: string) => {
    const officerName = prompt('Enter officer name to assign:');
    if (!officerName) return;
    try {
      await axios.patch(`/api/v1/applications/${appId}`, { assignedOfficerName: officerName });
      setRows(prev => prev.map(r => r.id === appId ? { ...r, assignedOfficerName: officerName } : r));
    } catch {
      alert('Could not assign officer');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" color="primary"  sx={{ fontWeight: 600 }}>Application Queue</Typography>
          {urgentCount > 0 && (
            <Chip label={`${urgentCount} Urgent`} color="error" size="small" />
          )}
        </Box>
        <TextField
          size="small" placeholder="Search ARN, Drug name..."
          value={searchText} onChange={e => setSearchText(e.target.value)}
          sx={{ width: 260 }}
        />
      </Box>

      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary"  sx={{ fontWeight: 600 }}>Status:</Typography>
        <ToggleButtonGroup size="small" exclusive value={statusFilter}
          onChange={(_, v) => v && setStatusFilter(v)}>
          {uniqueStatuses.map((s: any) => (
            <ToggleButton key={s} value={s} sx={{ textTransform: 'none', fontSize: 12 }}>
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="body2" color="textSecondary"  sx={{ ml: 2, fontWeight: 600 }}>Category:</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as string)}>
            {uniqueCategories.map((c: any) => <MenuItem key={c} value={c}>{c === 'ALL' ? 'All Categories' : c.replace(/_/g, ' ')}</MenuItem>)}
          </Select>
        </FormControl>

        <Typography variant="body2" color="textSecondary"  sx={{ ml: 2, fontWeight: 600 }}>State:</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={stateFilter} onChange={e => setStateFilter(e.target.value as string)}>
            {uniqueStates.map((s: any) => <MenuItem key={s} value={s}>{s === 'ALL' ? 'All States' : s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Card} sx={{ width: '100%', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600 }}>ARN / Ref. No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Drug Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>State</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned Officer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Days Pending</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No applications match the selected filters.</Typography>
                </TableCell>
              </TableRow>
            ) : filtered.map((row: any) => {
              const priority = getPriority(row.applicationDate);
              const daysPending = Math.floor((Date.now() - new Date(row.applicationDate).getTime()) / 86400000);
              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2"  color="primary" sx={{ fontWeight: 600 }}>
                      {row.arnNumber || row.applicationNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.genericName || row.drugName || '—'}</Typography>
                    {row.brandName && <Typography variant="caption" color="textSecondary">{row.brandName}</Typography>}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.displayCategory.replace(/_/g, ' ')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.state}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.assignedOfficerName || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={priority.label} color={priority.color} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={row.currentStatus.replace('_', ' ')} color={getStatusColor(row.currentStatus)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={daysPending > 30 ? 'error' : daysPending > 15 ? 'warning.main' : 'textPrimary'}>
                      {daysPending}d
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="primary"
                        onClick={() => navigate(`/officer/applications/${row.id}`)}>
                        Review
                      </Button>
                      <Tooltip title="Assign Officer">
                        <Button size="small" variant="outlined"
                          onClick={() => handleAssignOfficer(row.id)}>
                          Assign
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
