import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Radio, RadioGroup, FormControlLabel, Chip
} from '@mui/material';

const CHECKLIST_ITEMS = [
  { id: 'SM-01', section: 'Premises & Layout', label: 'Adequate size, construction and location of premises' },
  { id: 'SM-02', section: 'Premises & Layout', label: 'Proper segregation of manufacturing areas' },
  { id: 'SM-03', section: 'Premises & Layout', label: 'HVAC and environmental monitoring systems' },
  { id: 'SM-04', section: 'Equipment', label: 'Equipment qualification and calibration records' },
  { id: 'SM-05', section: 'Equipment', label: 'Equipment cleaning and maintenance procedures' },
  { id: 'SM-06', section: 'Documentation', label: 'SOPs available and current' },
  { id: 'SM-07', section: 'Documentation', label: 'Batch manufacturing records complete' },
  { id: 'SM-08', section: 'Documentation', label: 'Change control procedures in place' },
  { id: 'SM-09', section: 'Quality Control', label: 'QC laboratory equipment qualified' },
  { id: 'SM-10', section: 'Quality Control', label: 'Analytical methods validated' },
  { id: 'SM-11', section: 'Quality Control', label: 'Stability testing programme established' },
  { id: 'SM-12', section: 'Quality Assurance', label: 'Product quality review conducted annually' },
  { id: 'SM-13', section: 'Quality Assurance', label: 'Deviation and CAPA management system' },
  { id: 'SM-14', section: 'Quality Assurance', label: 'Internal audit programme operational' },
  { id: 'SM-15', section: 'Personnel', label: 'Qualified Person designated and competent' },
  { id: 'SM-16', section: 'Personnel', label: 'Training records maintained for all staff' },
  { id: 'SM-17', section: 'Materials', label: 'Raw material testing and release procedures' },
  { id: 'SM-18', section: 'Materials', label: 'Vendor qualification system in place' },
  { id: 'SM-19', section: 'Utilities', label: 'Water system validated and monitored' },
  { id: 'SM-20', section: 'Utilities', label: 'Compressed air/gas quality monitored' },
];

interface InspectionChecklistProps {
  values: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export const InspectionChecklist: React.FC<InspectionChecklistProps> = ({ values, onChange }) => {
  const compliant = Object.values(values).filter(v => v === 'COMPLIANT').length;
  const nonCompliant = Object.values(values).filter(v => v === 'NON_COMPLIANT').length;
  const na = Object.values(values).filter(v => v === 'NA').length;

  // Group items by section
  const sections = Array.from(new Set(CHECKLIST_ITEMS.map(i => i.section)));

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Form 35 / MD-11 GMP Checklist (Schedule M)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`✓ ${compliant} Compliant`} color="success" size="small" />
          <Chip label={`✗ ${nonCompliant} Non-Compliant`} color="error" size="small" />
          <Chip label={`— ${na} N/A`} size="small" />
        </Box>
      </Box>

      {nonCompliant > 0 && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
          <Typography variant="caption" color="error.main"  sx={{ fontWeight: 600 }}>
            ⚠ {nonCompliant} Non-Compliant item(s) found. Critical observations are required.
          </Typography>
        </Box>
      )}

      {sections.map(section => (
        <Box key={section} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 700, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>
            {section}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ width: 60, fontWeight: 600 }}>Ref</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                  <TableCell sx={{ width: 280, fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CHECKLIST_ITEMS.filter(i => i.section === section).map(item => (
                  <TableRow key={item.id} sx={{ bgcolor: values[item.id] === 'NON_COMPLIANT' ? '#fff5f5' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.label}</Typography>
                    </TableCell>
                    <TableCell>
                      <RadioGroup
                        row
                        value={values[item.id] || ''}
                        onChange={e => onChange(item.id, e.target.value)}
                      >
                        <FormControlLabel value="COMPLIANT" control={<Radio color="success" size="small" />} label="Compliant" />
                        <FormControlLabel value="NON_COMPLIANT" control={<Radio color="error" size="small" />} label="Non-Compliant" />
                        <FormControlLabel value="NA" control={<Radio size="small" />} label="N/A" />
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Paper>
  );
};
