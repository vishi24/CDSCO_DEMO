import React, { useState } from 'react';
import {
  Box, Typography, Stepper, Step, StepLabel, Button, Paper, TextField, MenuItem,
  useTheme, Alert, Grid, Checkbox, FormControlLabel, Radio, RadioGroup,
  FormLabel, FormControl, Chip
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import axios from 'axios';
import { PaymentSimulator } from './PaymentSimulator';

const FOREIGN_APPROVALS = ['US FDA', 'EMA', 'MHRA', 'TGA', 'PMDA', 'Health Canada', 'ANVISA', 'Others'];

const steps = [
  'Application Type',
  'Drug Details',
  'Manufacturer Info',
  'Documents Upload',
  'Fee & Payment',
  'Digital Signature',
  'Review & Submit'
];

const validationSchemas = [
  Yup.object({ caseType: Yup.string().required('Required') }),
  Yup.object({
    genericName: Yup.string().required('Generic (INN) Name is required'),
    brandName: Yup.string().required('Brand Name is required'),
    drugCategory: Yup.string().required('Required'),
    dosageForm: Yup.string().required('Required'),
    strengthComposition: Yup.string().required('Required'),
    routeOfAdministration: Yup.string().required('Required'),
    therapeuticCategory: Yup.string().required('Required'),
    packSize: Yup.string().required('Required'),
    shelfLife: Yup.string().required('Required'),
    storageConditions: Yup.string().required('Required'),
  }),
  Yup.object({
    manufacturerName: Yup.string().required('Required'),
    manufacturingSiteId: Yup.string().required('Manufacturing licence no. is required'),
    countryOfOrigin: Yup.string().required('Required'),
  }),
  Yup.object({}),
  Yup.object({}),
  Yup.object({ applicantDscToken: Yup.string().required('Required') }),
  Yup.object({ declaration: Yup.boolean().oneOf([true], 'You must accept the declaration') })
];

const FEE_MATRIX: Record<string, Record<string, number>> = {
  NEW_DRUG:   { FRESH: 500000, ENDORSEMENT: 150000, RE_REGISTRATION: 200000 },
  FDC:        { FRESH: 300000, ENDORSEMENT: 100000, RE_REGISTRATION: 150000 },
  BIOLOGICAL: { FRESH: 1000000, ENDORSEMENT: 300000, RE_REGISTRATION: 500000 },
  GENERIC:    { FRESH: 75000, ENDORSEMENT: 25000, RE_REGISTRATION: 40000 },
  MEDICAL_DEVICE: { FRESH: 50000, ENDORSEMENT: 25000, RE_REGISTRATION: 40000 },
};

const calcFee = (category: string, caseType: string): number =>
  FEE_MATRIX[category]?.[caseType] ?? 75000;

const initialValues = {
  caseType: 'FRESH', previousRcNumber: '',
  genericName: '', brandName: '', drugCategory: 'NEW_DRUG',
  dosageForm: '', strengthComposition: '', routeOfAdministration: '',
  therapeuticCategory: '', proposedIndications: '',
  packSize: '', shelfLife: '', storageConditions: '', pharmacopoeia: '',
  manufacturerName: '', manufacturingSiteId: '', manufacturingSiteAddress: '',
  countryOfOrigin: 'India', manufacturingLicenseNumber: '',
  approvalStatusOriginCountry: '', foreignRegulatoryApprovals: [] as string[],
  paymentMode: 'NTRP', paymentReference: '',
  applicantDscToken: '', declaration: false
};

export const NewApplication: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { organizationId, token } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [dscSigned, setDscSigned] = useState(false);
  const [dscOtp, setDscOtp] = useState('');
  const isLastStep = activeStep === steps.length - 1;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const handleNext = async (values: typeof initialValues, actions: any) => {
    if (activeStep === 4 && !paymentSuccess) {
      alert('Please complete payment to proceed.');
      actions.setSubmitting(false);
      return;
    }
    if (activeStep === 5 && !dscSigned) {
      if (dscOtp !== '123456') {
        alert('Invalid DSC Token PIN. Demo Hint: Use 123456');
        actions.setSubmitting(false);
        return;
      }
      setDscSigned(true);
      (values as any).applicantDscToken = 'DSC_SIGNED_VALID';
      actions.setSubmitting(false);
      return;
    }
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        const fee = calcFee(values.drugCategory, values.caseType);
        const payload = {
          ...values,
          licenceType: 'MANUFACTURING',
          // Use the logged-in user's organizationId from JWT, fall back to demo UUID
          organizationId: organizationId || '00000000-0000-0000-0000-000000000001',
          feePaid: true, feeAmount: fee,
          digitalSigned: true,
          foreignRegulatoryApprovals: JSON.stringify(values.foreignRegulatoryApprovals),
        };
        const response = await axios.post('/api/v1/applications', payload, { headers: authHeader });
        const arn = response.data.arnNumber || response.data.applicationNumber;
        navigate('/industry/applications', {
          state: { message: `Application ${arn} submitted successfully! Track it from your dashboard.` }
        });
      } catch {
        alert('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
        actions.setSubmitting(false);
      }
    } else {
      setActiveStep(s => s + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const toggleForeignApproval = (values: typeof initialValues, setFieldValue: any, label: string) => {
    const cur = values.foreignRegulatoryApprovals;
    const next = cur.includes(label) ? cur.filter(x => x !== label) : [...cur, label];
    setFieldValue('foreignRegulatoryApprovals', next);
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 4, pb: 6, px: 2, background: theme.palette.background.default }}>
      <Box sx={{ maxWidth: 1050, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom color="primary"  sx={{ fontWeight: 700 }}>
            Form 40 — Drug Manufacturing Licence Application
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleNext}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                <Box sx={{ minHeight: 420 }}>

                  {/* ── STEP 1: Application Type ── */}
                  {activeStep === 0 && (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <FormControl component="fieldset">
                          <FormLabel required>Case Type</FormLabel>
                          <RadioGroup row value={values.caseType}
                            onChange={e => setFieldValue('caseType', e.target.value)}>
                            <FormControlLabel value="FRESH" control={<Radio />} label="Fresh Application" />
                            <FormControlLabel value="ENDORSEMENT" control={<Radio />} label="Endorsement" />
                            <FormControlLabel value="RE_REGISTRATION" control={<Radio />} label="Re-registration" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      {values.caseType !== 'FRESH' && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="previousRcNumber"
                            label="Previous RC Number (mandatory for Endorsement / Re-reg)"
                            error={touched.previousRcNumber && !!errors.previousRcNumber}
                            helperText={touched.previousRcNumber && errors.previousRcNumber as string} />
                        </Grid>
                      )}

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} select fullWidth name="drugCategory" label="Drug / Product Category">
                          <MenuItem value="NEW_DRUG">New Drug</MenuItem>
                          <MenuItem value="FDC">Fixed Dose Combination (FDC)</MenuItem>
                          <MenuItem value="BIOLOGICAL">Biological / Vaccine</MenuItem>
                          <MenuItem value="GENERIC">Generic Drug</MenuItem>
                          <MenuItem value="MEDICAL_DEVICE">Medical Device</MenuItem>
                          <MenuItem value="COSMETIC">Cosmetic</MenuItem>
                        </Field>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Alert severity="info">
                          Applicable Fee: <strong>₹ {calcFee(values.drugCategory, values.caseType).toLocaleString('en-IN')}</strong> (auto-calculated)
                        </Alert>
                      </Grid>
                    </Grid>
                  )}

                  {/* ── STEP 2: Drug Details ── */}
                  {activeStep === 1 && (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} fullWidth name="genericName" label="Generic Name (INN) *"
                          error={touched.genericName && !!errors.genericName}
                          helperText={touched.genericName && errors.genericName as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} fullWidth name="brandName" label="Brand / Trade Name *"
                          error={touched.brandName && !!errors.brandName}
                          helperText={touched.brandName && errors.brandName as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} select fullWidth name="dosageForm" label="Dosage Form *"
                          error={touched.dosageForm && !!errors.dosageForm}
                          helperText={touched.dosageForm && errors.dosageForm as string}>
                          {['Tablet', 'Capsule', 'Injection', 'Syrup', 'Ointment', 'Inhaler', 'Patch'].map(f =>
                            <MenuItem key={f} value={f.toUpperCase()}>{f}</MenuItem>)}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} select fullWidth name="routeOfAdministration" label="Route of Administration *"
                          error={touched.routeOfAdministration && !!errors.routeOfAdministration}
                          helperText={touched.routeOfAdministration && errors.routeOfAdministration as string}>
                          {['Oral', 'Parenteral', 'Topical', 'Inhalation', 'Ophthalmic', 'Rectal'].map(r =>
                            <MenuItem key={r} value={r.toUpperCase()}>{r}</MenuItem>)}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="strengthComposition" label="Strength / Composition *"
                          placeholder="e.g. 500mg / 5mg+10mg"
                          error={touched.strengthComposition && !!errors.strengthComposition}
                          helperText={touched.strengthComposition && errors.strengthComposition as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} select fullWidth name="therapeuticCategory" label="Therapeutic Category (WHO ATC) *"
                          error={touched.therapeuticCategory && !!errors.therapeuticCategory}
                          helperText={touched.therapeuticCategory && errors.therapeuticCategory as string}>
                          {['Antibacterials', 'Analgesics', 'Antihypertensives', 'Antidiabetics',
                            'Antivirals', 'Antifungals', 'Vitamins & Minerals', 'Oncologics', 'Others'].map(t =>
                            <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} select fullWidth name="pharmacopoeia" label="Pharmacopoeia Standard">
                          {['IP', 'USP', 'BP', 'EP', 'Non-Pharmacopoeial'].map(p =>
                            <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="packSize" label="Pack Size *"
                          placeholder="e.g. 10x10 Blister"
                          error={touched.packSize && !!errors.packSize}
                          helperText={touched.packSize && errors.packSize as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="shelfLife" label="Shelf Life (Months) *" type="number"
                          error={touched.shelfLife && !!errors.shelfLife}
                          helperText={touched.shelfLife && errors.shelfLife as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="storageConditions" label="Storage Conditions *"
                          placeholder="e.g. Store below 25°C"
                          error={touched.storageConditions && !!errors.storageConditions}
                          helperText={touched.storageConditions && errors.storageConditions as string} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Field as={TextField} fullWidth multiline rows={3}
                          name="proposedIndications" label="Proposed Indications (max 2000 chars)"
                          inputProps={{ maxLength: 2000 }} />
                      </Grid>
                    </Grid>
                  )}

                  {/* ── STEP 3: Manufacturer Info ── */}
                  {activeStep === 2 && (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} fullWidth name="manufacturerName" label="Manufacturer Name *"
                          error={touched.manufacturerName && !!errors.manufacturerName}
                          helperText={touched.manufacturerName && errors.manufacturerName as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} fullWidth name="manufacturingSiteId" label="Manufacturing Licence No. *"
                          error={touched.manufacturingSiteId && !!errors.manufacturingSiteId}
                          helperText={touched.manufacturingSiteId && errors.manufacturingSiteId as string} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Field as={TextField} fullWidth multiline rows={2}
                          name="manufacturingSiteAddress" label="Manufacturing Site Address" />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="countryOfOrigin" label="Country of Origin *"
                          error={touched.countryOfOrigin && !!errors.countryOfOrigin}
                          helperText={touched.countryOfOrigin && errors.countryOfOrigin as string} />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} fullWidth name="manufacturingLicenseNumber"
                          label="Manufacturing License No. (Origin Country)" />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Field as={TextField} select fullWidth name="approvalStatusOriginCountry"
                          label="Approval Status in Origin Country">
                          <MenuItem value="APPROVED">Approved</MenuItem>
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="NOT_FILED">Not Filed</MenuItem>
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Foreign Regulatory Approvals (select all that apply)
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {FOREIGN_APPROVALS.map(label => (
                            <Chip
                              key={label}
                              label={label}
                              clickable
                              color={values.foreignRegulatoryApprovals.includes(label) ? 'primary' : 'default'}
                              onClick={() => toggleForeignApproval(values, setFieldValue, label)}
                              variant={values.foreignRegulatoryApprovals.includes(label) ? 'filled' : 'outlined'}
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {/* ── STEP 4: Documents ── */}
                  {activeStep === 3 && (
                    <Box>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        All documents must be in PDF format. CTD Dossier max 100 MB, others max 10 MB.
                      </Alert>
                      <Grid container spacing={2}>
                        {[
                          { name: 'CTD / eCTD Dossier', size: '100 MB', mandatory: true },
                          { name: 'Package Insert / SmPC', size: '10 MB', mandatory: true },
                          { name: 'GMP Compliance Certificate', size: '10 MB', mandatory: true },
                          { name: 'Covering Letter', size: '5 MB', mandatory: true },
                          { name: 'Power of Attorney (PoA)', size: '5 MB', mandatory: true },
                          { name: 'Foreign Regulatory Approval Certificate', size: '10 MB',
                            mandatory: values.foreignRegulatoryApprovals.length > 0 },
                          { name: 'Bio-equivalence / Clinical Study Report', size: '20 MB',
                            mandatory: values.caseType === 'FRESH' },
                          { name: 'Patent Status Declaration & Undertaking', size: '2 MB', mandatory: true },
                        ].map(doc => (
                          <Grid size={{ xs: 12, md: 6 }} key={doc.name}>
                            <Box sx={{
                              border: `1px dashed ${doc.mandatory ? '#1976d2' : '#bbb'}`,
                              p: 2, borderRadius: 1,
                              bgcolor: doc.mandatory ? '#f0f7ff' : '#fafafa'
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2"  sx={{ fontWeight: 500 }}>{doc.name}</Typography>
                                <Chip label={doc.mandatory ? 'Mandatory' : 'Conditional'}
                                  color={doc.mandatory ? 'primary' : 'default'} size="small" />
                              </Box>
                              <Typography variant="caption" color="textSecondary">Max: {doc.size}</Typography>
                              <Box sx={{ mt: 1 }}>
                                <Button variant="outlined" size="small" component="label">
                                  Upload PDF <input type="file" hidden accept=".pdf" />
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* ── STEP 5: Fee & Payment ── */}
                  {activeStep === 4 && (
                    <Box>
                      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Fee Summary</Typography>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 6 }}><Typography color="textSecondary">Case Type</Typography></Grid>
                          <Grid size={{ xs: 6 }}><Typography>{values.caseType}</Typography></Grid>
                          <Grid size={{ xs: 6 }}><Typography color="textSecondary">Drug Category</Typography></Grid>
                          <Grid size={{ xs: 6 }}><Typography>{values.drugCategory}</Typography></Grid>
                          <Grid size={{ xs: 6 }}><Typography  sx={{ fontWeight: 700 }}>Total Application Fee</Typography></Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography  color="primary" sx={{ fontWeight: 700 }}>
                              ₹ {calcFee(values.drugCategory, values.caseType).toLocaleString('en-IN')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      {paymentSuccess ? (
                        <Alert severity="success">
                          Payment Successful! UTR Reference: <strong>{values.paymentReference}</strong>
                        </Alert>
                      ) : (
                        <PaymentSimulator
                          amount={calcFee(values.drugCategory, values.caseType)}
                          onSuccess={utr => {
                            setFieldValue('paymentReference', utr);
                            setPaymentSuccess(true);
                          }}
                        />
                      )}
                    </Box>
                  )}

                  {/* ── STEP 6: DSC ── */}
                  {activeStep === 5 && (
                    <Box sx={{ textAlign: 'center', p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>Digital Signature Certificate (DSC)</Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Sign the application electronically using your DSC Token PIN (Aadhaar OTP in demo mode).
                      </Typography>
                      {dscSigned ? (
                        <Alert severity="success">
                          Application digitally signed. ✓ Timestamp: {new Date().toLocaleString('en-IN')}
                        </Alert>
                      ) : (
                        <>
                          <TextField
                            label="DSC Token PIN / Aadhaar OTP" type="password"
                            value={dscOtp} onChange={e => setDscOtp(e.target.value)} sx={{ mb: 1 }} />
                          <Typography variant="caption"  sx={{ mb: 2, display: 'block' }}>Demo Hint: 123456</Typography>
                          <Button variant="contained" size="large"
                            onClick={() => handleNext(values, { setSubmitting: () => {} })}>
                            Sign with Aadhaar OTP
                          </Button>
                        </>
                      )}
                    </Box>
                  )}

                  {/* ── STEP 7: Review & Submit ── */}
                  {activeStep === 6 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>Review Your Application</Typography>
                      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={2}>
                          {[
                            ['Case Type', values.caseType],
                            ['Drug Category', values.drugCategory],
                            ['Generic Name (INN)', values.genericName],
                            ['Brand Name', values.brandName],
                            ['Dosage Form', values.dosageForm],
                            ['Strength', values.strengthComposition],
                            ['Route', values.routeOfAdministration],
                            ['Therapeutic Category', values.therapeuticCategory],
                            ['Manufacturer', values.manufacturerName],
                            ['Country of Origin', values.countryOfOrigin],
                            ['Payment UTR', values.paymentReference],
                            ['DSC Signed', dscSigned ? 'Yes ✓' : 'No'],
                          ].map(([label, val]) => (
                            <Grid size={{ xs: 6 }} key={label as string}>
                              <Typography variant="caption" color="textSecondary">{label}</Typography>
                              <Typography variant="body2"  sx={{ fontWeight: 500 }}>{val || '—'}</Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>

                      <Alert severity="info" sx={{ mb: 2 }}>
                        On submission, an ARN (Application Reference Number) of format{' '}
                        <strong>ARN/CDSCO/{new Date().getFullYear()}/XXXXXXXX</strong> will be generated and displayed on your dashboard.
                      </Alert>

                      <FormControlLabel
                        control={
                          <Field as={Checkbox} name="declaration" color="primary"
                            checked={(values as any).declaration}
                            onChange={(e: any) => setFieldValue('declaration', e.target.checked)} />
                        }
                        label="I declare that all particulars given above are true and correct to the best of my knowledge and belief."
                      />
                      {touched.declaration && errors.declaration && (
                        <Typography color="error" variant="caption"  sx={{ display: 'block' }}>
                          {errors.declaration as string}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button disabled={activeStep === 0 || isSubmitting} onClick={() => setActiveStep(s => s - 1)} variant="outlined">
                    Back
                  </Button>
                  {!(activeStep === 5 && !dscSigned) && (
                    <Button type="submit" variant="contained" color="primary"
                      disabled={isSubmitting || (activeStep === 4 && !paymentSuccess)}>
                      {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit Application' : 'Next Step'}
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
};

