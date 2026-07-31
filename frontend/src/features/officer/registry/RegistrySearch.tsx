import React, { useState } from 'react';
import { Box, Typography, Card, TextField, Button, Grid, Chip } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

export const RegistrySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const columns: GridColDef[] = [
    { field: 'registryId', headerName: 'Registry ID', width: 180 },
    { field: 'brandName', headerName: 'Brand Name', width: 220 },
    { field: 'genericName', headerName: 'Generic Name', width: 220 },
    { field: 'drugCategory', headerName: 'Category', width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} color="success" size="small" />
      )
    },
  ];

  const [rows] = useState([
    { id: '1', registryId: 'DRUG-1721012300', brandName: 'Paracetamol 500mg', genericName: 'Acetaminophen', drugCategory: 'ALLOPATHIC', status: 'REGISTERED' },
    { id: '2', registryId: 'DRUG-1721012301', brandName: 'Crocine Advance', genericName: 'Acetaminophen', drugCategory: 'ALLOPATHIC', status: 'REGISTERED' },
  ]);

  const handleSearch = () => {
    setSearched(true);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 3 }}>National Drug Registry Search</Typography>
      
      <Card sx={{ p: 3, mb: 4 }} elevation={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Search by Brand Name, Generic Name, or Registry ID"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {searched && (
        <Card sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25]}
            disableRowSelectionOnClick
          />
        </Card>
      )}
    </Box>
  );
};
