import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Divider, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ApplicationReview: React.FC = () => {
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState('');
  const [showQuery, setShowQuery] = useState(false);

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>Review Application</Typography>
        <Button variant="outlined" onClick={() => navigate('/officer/applications')}>Back to Queue</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Application Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Application Number</Typography>
                  <Typography variant="body1">APP-1721012300</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Applicant Organization</Typography>
                  <Typography variant="body1">Sun Pharmaceuticals Ltd</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Licence Type</Typography>
                  <Typography variant="body1">Medical Device (MD-5)</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Product Name</Typography>
                  <Typography variant="body1">Advanced Cardiac Stent X1</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Documents</Typography>
              <Divider sx={{ mb: 2 }} />
              <Button variant="outlined" color="primary" sx={{ mr: 2 }}>View Technical Specs</Button>
              <Button variant="outlined" color="primary">View Form 28</Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Actions</Typography>
              <Divider sx={{ mb: 2 }} />
              
              {!showQuery ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" color="success" onClick={() => navigate('/officer/applications')}>
                    Approve & Issue Certificate
                  </Button>
                  <Button variant="outlined" color="warning" onClick={() => setShowQuery(true)}>
                    Raise Query
                  </Button>
                  <Button variant="outlined" color="error">
                    Reject Application
                  </Button>
                </Box>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Query Details"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="warning" onClick={() => { setShowQuery(false); navigate('/officer/applications'); }}>
                      Submit Query
                    </Button>
                    <Button variant="text" onClick={() => setShowQuery(false)}>Cancel</Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
