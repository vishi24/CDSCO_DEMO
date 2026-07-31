import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Card } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export const CertificateList: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'certificateNumber', headerName: 'Certificate No.', width: 220 },
    { field: 'licenceType', headerName: 'Licence Type', width: 220 },
    { field: 'issueDate', headerName: 'Issue Date', width: 130 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 130 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} color={params.value === 'ACTIVE' ? 'success' : 'error'} size="small" />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
          <Button size="small" variant="text" startIcon={<QrCodeScannerIcon />}>
            Verify
          </Button>
        </Box>
      )
    }
  ];

  const [rows] = useState([
    { id: '1', certificateNumber: 'CDSCO-1721014500', licenceType: 'DRUG_MANUFACTURING', issueDate: '2026-07-21', expiryDate: '2031-07-20', status: 'ACTIVE' },
    { id: '2', certificateNumber: 'CDSCO-1621014500', licenceType: 'MEDICAL_DEVICE', issueDate: '2021-07-21', expiryDate: '2026-07-20', status: 'EXPIRED' },
  ]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, mb: 3 }}>My Certificates</Typography>
      <Card sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Card>
    </Box>
  );
};
