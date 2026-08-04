import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Tabs, Tab, TextField, CircularProgress,
  Grid, MenuItem, Select, FormControl, InputLabel, Chip, Alert,
  Radio, RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InspectionChecklist } from './InspectionChecklist';
import { GeotagCapture } from './GeotagCapture';
import { LicenseIssuanceCard } from './LicenseIssuanceCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const ApplicationReview: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  // Scrutiny Tab
  const [scrutinyStatus, setScrutinyStatus] = useState('UNDER_REVIEW');
  const [scrutinyComments, setScrutinyComments] = useState('');
  const [deficiencyRemarks, setDeficiencyRemarks] = useState('');
  const [responseDeadline, setResponseDeadline] = useState('');

  // Inspection Tab
  const [inspectionType, setInspectionType] = useState('ROUTINE');
  const [inspectionDate, setInspectionDate] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [checklist, setChecklist] = useState<Record<string, string>>({});
  const [criticalObservations, setCriticalObservations] = useState('');
  const [observationSeverity, setObservationSeverity] = useState('MINOR');
  const [location, setLocation] = useState<any>(null);

  // Decision Tab
  const [decision, setDecision] = useState('APPROVED');
  const [licenseValidity, setLicenseValidity] = useState('3');
  const [approvalConditions, setApprovalConditions] = useState('');
  const [rejectionReasonCode, setRejectionReasonCode] = useState('');
  const [rejectionNarrative, setRejectionNarrative] = useState('');
  const [officerDscOtp, setOfficerDscOtp] = useState('');
  const [officerSigned, setOfficerSigned] = useState(false);
  const [licenseIssued, setLicenseIssued] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');

  useEffect(() => {
    axios.get(`/api/v1/applications/${id}`)
      .then(res => setApp(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleScrutinyAction = async (action: string) => {
    try {
      await axios.post(`/api/v1/applications/${id}/transition`, {
        action,
        toStage: action,
        comments: deficiencyRemarks || scrutinyComments,
        scrutinyStatus,
        responseDeadline
      });
      setApp({ ...app, currentStatus: action });
      if (action === 'INSPECTION_SCHEDULED') setTabValue(1);
    } catch (err) {
      console.error(err);
      alert('Error updating scrutiny status');
    }
  };

  const handleInspectionSubmit = async () => {
    try {
      await axios.post(`/api/v1/inspections`, {
        applicationId: id,
        inspectionType,
        inspectionDate,
        teamMembers,
        checklistJson: JSON.stringify(checklist),
        criticalObservations,
        observationSeverity,
        latitude: location?.lat,
        longitude: location?.lng
      });
      await axios.post(`/api/v1/applications/${id}/transition`, {
        action: 'INSPECTION_COMPLETE',
        toStage: 'INSPECTION_COMPLETED',
        comments: criticalObservations
      });
      setApp({ ...app, currentStatus: 'INSPECTION_COMPLETED' });
      setTabValue(2);
    } catch (err) {
      console.error(err);
      alert('Error submitting inspection report');
    }
  };

  const handleOfficerSign = async () => {
    if (officerDscOtp !== '123456') {
      alert('Invalid DSC PIN. Demo Hint: 123456');
      return;
    }
    const year = new Date().getFullYear();
    const rcNo = `RC/CDSCO/${year}/${String(Math.floor(Math.random() * 90000) + 10000).padStart(8, '0')}`;
    try {
      await axios.post(`/api/v1/applications/${id}/transition`, {
        action: 'APPROVE',
        toStage: 'APPROVED',
        comments: approvalConditions || 'Approved',
        decisionStatus: decision,
        rcLicenseNumber: rcNo,
        licenseValidity,
        officerSigned: true
      });
      setLicenseNumber(rcNo);
      setOfficerSigned(true);
      setLicenseIssued(true);
      setApp({ ...app, currentStatus: 'APPROVED' });
    } catch (err) {
      console.error(err);
      alert('Error signing and issuing license');
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`/api/v1/applications/${id}/transition`, {
        action: 'REJECT',
        toStage: 'REJECTED',
        comments: rejectionNarrative,
        rejectionReasonCode
      });
      navigate('/officer/queue');
    } catch (err) {
      console.error(err);
      alert('Error rejecting application');
    }
  };

  if (!app) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  const isInspectionEnabled = ['INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'APPROVED'].includes(app.currentStatus);
  const isIssuanceEnabled = app.currentStatus === 'APPROVED' || licenseIssued;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
          Review: {app.applicationNumber}
        </Typography>
        <Chip
          label={app.currentStatus}
          color={app.currentStatus === 'APPROVED' ? 'success' : app.currentStatus === 'REJECTED' ? 'error' : 'warning'}
          size="medium"
        />
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)} centered>
          <Tab label="1. Document Scrutiny" />
          <Tab label="2. Field Inspection" disabled={!isInspectionEnabled} />
          <Tab label="3. Decision & Issuance" disabled={!isIssuanceEnabled} />
        </Tabs>
      </Paper>

      {/* ════════════════ TAB 1: SCRUTINY ════════════════ */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Left: Application Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Form 40 Details</Typography>
              <Grid container spacing={2}>
                {[
                  ['Drug Name', app.drugName], ['Brand Name', app.brandName],
                  ['Drug Category', app.drugClass], ['Dosage Form', app.dosageForm],
                  ['Route of Administration', app.routeOfAdministration],
                  ['Pack Size', app.packSize], ['Shelf Life', app.shelfLife],
                  ['Manufacturing Site', app.manufacturingSiteId],
                  ['Country of Origin', app.countryOfOrigin],
                  ['ARN / Ref No.', app.arnNumber || app.applicationNumber],
                ].map(([label, val]) => (
                  <Grid size={{ xs: 6 }} key={label as string}>
                    <Typography variant="caption" color="textSecondary">{label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{val || '—'}</Typography>
                  </Grid>
                ))}
                {app.proposedIndications && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary">Proposed Indications</Typography>
                    <Typography variant="body2">{app.proposedIndications}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Right: Scrutiny Action Panel */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Scrutiny Action</Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Scrutiny Status</InputLabel>
                <Select value={scrutinyStatus} label="Scrutiny Status" onChange={e => setScrutinyStatus(e.target.value)}>
                  <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                  <MenuItem value="DEFICIENCY_RAISED">Deficiency Raised</MenuItem>
                  <MenuItem value="TECHNICAL_REVIEW">Technical Review</MenuItem>
                  <MenuItem value="INSPECTION_SCHEDULED">Inspection Required</MenuItem>
                  <MenuItem value="APPROVED">Approved (Direct)</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth multiline rows={3}
                label="Scrutiny Comments"
                value={scrutinyComments}
                onChange={e => setScrutinyComments(e.target.value)}
                sx={{ mb: 2 }}
              />

              {scrutinyStatus === 'DEFICIENCY_RAISED' && (
                <>
                  <TextField
                    fullWidth multiline rows={3}
                    label="Deficiency Remarks (max 5000 chars)"
                    value={deficiencyRemarks}
                    onChange={e => setDeficiencyRemarks(e.target.value)}
                    slotProps={{ htmlInput: { maxLength: 5000 } }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth type="date"
                    label="Applicant Response Deadline"
                    value={responseDeadline}
                    onChange={e => setResponseDeadline(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] } }}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" color="primary"
                  onClick={() => handleScrutinyAction(scrutinyStatus)}>
                  Save Scrutiny Decision
                </Button>
                {scrutinyStatus === 'INSPECTION_SCHEDULED' && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Switch to Tab 2 to schedule and conduct the inspection.
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ════════════════ TAB 2: FIELD INSPECTION ════════════════ */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Inspection Scheduling */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Schedule Inspection</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Inspection Type</InputLabel>
                    <Select value={inspectionType} label="Inspection Type" onChange={e => setInspectionType(e.target.value)}>
                      <MenuItem value="ROUTINE">Routine</MenuItem>
                      <MenuItem value="FOR_CAUSE">For Cause</MenuItem>
                      <MenuItem value="PRE_LICENCE">Pre-licence</MenuItem>
                      <MenuItem value="JOINT">Joint</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth type="date" label="Inspection Date"
                    value={inspectionDate}
                    onChange={e => setInspectionDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0] } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth label="Inspection Team Members (comma-separated)"
                    value={teamMembers}
                    onChange={e => setTeamMembers(e.target.value)}
                    placeholder="Dr. Ramesh, Dr. Priya..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Form 35 Checklist */}
          <Grid size={{ xs: 12, md: 7 }}>
            <InspectionChecklist
              values={checklist}
              onChange={(field, val) => setChecklist(prev => ({ ...prev, [field]: val }))}
            />
          </Grid>

          {/* GPS + Observations */}
          <Grid size={{ xs: 12, md: 5 }}>
            <GeotagCapture onCapture={(loc) => setLocation(loc)} />

            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Critical Observations</Typography>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel>Severity</FormLabel>
                <RadioGroup row value={observationSeverity} onChange={e => setObservationSeverity(e.target.value)}>
                  <FormControlLabel value="CRITICAL" control={<Radio color="error" />} label="Critical" />
                  <FormControlLabel value="MAJOR" control={<Radio color="warning" />} label="Major" />
                  <FormControlLabel value="MINOR" control={<Radio color="success" />} label="Minor" />
                </RadioGroup>
              </FormControl>
              <TextField
                fullWidth multiline rows={3}
                label="Describe Critical Observations"
                value={criticalObservations}
                onChange={e => setCriticalObservations(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle2" gutterBottom>Inspection Report Upload (PDF, max 20 MB)</Typography>
              <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                Upload Report PDF
                <input type="file" hidden accept=".pdf" />
              </Button>
              <Typography variant="subtitle2" gutterBottom>Site Photographs (max 20 images)</Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload Photos (JPG/PNG)
                <input type="file" hidden accept="image/*" multiple />
              </Button>
            </Paper>

            <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained" color="primary" size="large" fullWidth
                onClick={handleInspectionSubmit}
                disabled={!location || !inspectionDate}
              >
                Submit Inspection Report
              </Button>
              {(!location || !inspectionDate) && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  GPS location and inspection date are required.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* ════════════════ TAB 3: DECISION & ISSUANCE ════════════════ */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Decision</Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Decision</InputLabel>
                <Select value={decision} label="Decision" onChange={e => setDecision(e.target.value)}>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="APPROVED_WITH_CONDITIONS">Approved with Conditions</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                  <MenuItem value="DEFERRED">Deferred</MenuItem>
                </Select>
              </FormControl>

              {decision === 'APPROVED' || decision === 'APPROVED_WITH_CONDITIONS' ? (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>License Validity Period</InputLabel>
                    <Select value={licenseValidity} label="License Validity Period" onChange={e => setLicenseValidity(e.target.value)}>
                      <MenuItem value="1">1 Year</MenuItem>
                      <MenuItem value="3">3 Years</MenuItem>
                      <MenuItem value="5">5 Years</MenuItem>
                    </Select>
                  </FormControl>
                  {decision === 'APPROVED_WITH_CONDITIONS' && (
                    <TextField
                      fullWidth multiline rows={3}
                      label="Approval Conditions"
                      value={approvalConditions}
                      onChange={e => setApprovalConditions(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  )}
                </>
              ) : decision === 'REJECTED' ? (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Rejection Reason Code</InputLabel>
                    <Select value={rejectionReasonCode} label="Rejection Reason Code" onChange={e => setRejectionReasonCode(e.target.value)}>
                      <MenuItem value="R01">R01 — Incomplete Dossier</MenuItem>
                      <MenuItem value="R02">R02 — GMP Non-Compliance</MenuItem>
                      <MenuItem value="R03">R03 — Safety Concerns</MenuItem>
                      <MenuItem value="R04">R04 — Efficacy Not Established</MenuItem>
                      <MenuItem value="R05">R05 — Other</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth multiline rows={3}
                    label="Rejection Narrative"
                    value={rejectionNarrative}
                    onChange={e => setRejectionNarrative(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="error" fullWidth onClick={handleReject}>
                    Confirm Rejection
                  </Button>
                </>
              ) : null}
            </Paper>
          </Grid>

          {/* Officer DSC Signing */}
          {(decision === 'APPROVED' || decision === 'APPROVED_WITH_CONDITIONS') && !licenseIssued && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Officer Digital Signature (DSC)</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Enter your DSC Token PIN to digitally sign and issue the licence.
                </Typography>
                {officerSigned ? (
                  <Alert severity="success">Document signed. Generating RC...</Alert>
                ) : (
                  <>
                    <TextField
                      label="DSC Token PIN" type="password"
                      value={officerDscOtp}
                      onChange={e => setOfficerDscOtp(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                      Demo Hint: 123456
                    </Typography>
                    <Button variant="contained" color="success" size="large" onClick={handleOfficerSign}>
                      Sign & Issue Licence
                    </Button>
                  </>
                )}
              </Paper>
            </Grid>
          )}

          {/* Issued License Card */}
          {licenseIssued && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Licence issued successfully! A fake DigiLocker notification has been sent to the applicant.
              </Alert>
              <LicenseIssuanceCard
                applicationNumber={app.applicationNumber}
                organizationName={app.organizationName || 'Demo Pharmaceuticals Ltd.'}
                licenceNumber={licenseNumber}
                validUntil={new Date(new Date().setFullYear(new Date().getFullYear() + parseInt(licenseValidity))).toLocaleDateString('en-IN')}
                drugName={app.drugName || 'Generic Drug'}
              />
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default ApplicationReview;
