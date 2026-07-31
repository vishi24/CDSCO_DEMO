import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  TextField,
  MenuItem,
  useTheme,
  Alert,
  Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const steps = ['Organization Details', 'Contact Person', 'Documents & Upload', 'Review & Submit'];

const validationSchemas = [
  Yup.object({
    orgName: Yup.string().required('Organization name is required'),
    orgType: Yup.string().required('Organization type is required'),
    gstNumber: Yup.string().required('GST Number is required'),
    panNumber: Yup.string().required('PAN Number is required'),
    city: Yup.string().required('City is required'),
    stateCode: Yup.string().required('State is required'),
  }),
  Yup.object({
    contactPersonName: Yup.string().required('Contact person name is required'),
    contactPersonDesignation: Yup.string().required('Designation is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string().required('Mobile number is required'),
  }),
  Yup.object({
    // Docs can be optional for UI demo purposes, but we can require them if needed
  }),
  Yup.object({})
];

const initialValues = {
  orgName: '',
  orgType: '',
  gstNumber: '',
  panNumber: '',
  city: '',
  stateCode: '',
  contactPersonName: '',
  contactPersonDesignation: '',
  email: '',
  mobile: '',
  document1: null,
  document2: null
};

const RegistrationPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLastStep = activeStep === steps.length - 1;

  const submitForm = async (values: any, actions: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await axios.post('/api/v1/organizations/register', values);
      if (response.status === 200 || response.status === 201) {
        navigate('/register/success', { state: { orgCode: response.data.orgCode } });
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  const handleNext = (values: any, actions: any) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 6, px: 2, background: theme.palette.background.default }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 4, textAlign: 'center' }}>
              Organization Registration
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchemas[activeStep]}
              onSubmit={handleNext}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <Box sx={{ minHeight: 300 }}>
                    {activeStep === 0 && (
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="orgName" label="Organization Name"
                            error={touched.orgName && !!errors.orgName} helperText={touched.orgName && (errors.orgName as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} select fullWidth name="orgType" label="Organization Type"
                            error={touched.orgType && !!errors.orgType} helperText={touched.orgType && (errors.orgType as string)}>
                            <MenuItem value="PHARMA">Pharmaceutical Manufacturer</MenuItem>
                            <MenuItem value="DEVICE">Medical Device Manufacturer</MenuItem>
                            <MenuItem value="COSMETIC">Cosmetics Manufacturer</MenuItem>
                            <MenuItem value="BLOOD_BANK">Blood Bank</MenuItem>
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="gstNumber" label="GST Number"
                            error={touched.gstNumber && !!errors.gstNumber} helperText={touched.gstNumber && (errors.gstNumber as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="panNumber" label="PAN Number"
                            error={touched.panNumber && !!errors.panNumber} helperText={touched.panNumber && (errors.panNumber as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="city" label="City"
                            error={touched.city && !!errors.city} helperText={touched.city && (errors.city as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="stateCode" label="State Code"
                            error={touched.stateCode && !!errors.stateCode} helperText={touched.stateCode && (errors.stateCode as string)} />
                        </Grid>
                      </Grid>
                    )}

                    {activeStep === 1 && (
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="contactPersonName" label="Contact Person Name"
                            error={touched.contactPersonName && !!errors.contactPersonName} helperText={touched.contactPersonName && (errors.contactPersonName as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="contactPersonDesignation" label="Designation"
                            error={touched.contactPersonDesignation && !!errors.contactPersonDesignation} helperText={touched.contactPersonDesignation && (errors.contactPersonDesignation as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="email" label="Official Email ID"
                            error={touched.email && !!errors.email} helperText={touched.email && (errors.email as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="mobile" label="Mobile Number"
                            error={touched.mobile && !!errors.mobile} helperText={touched.mobile && (errors.mobile as string)} />
                        </Grid>
                      </Grid>
                    )}

                    {activeStep === 2 && (
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>Please upload the required KYC and registration documents.</Typography>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <Button variant="outlined" component="label" fullWidth sx={{ p: 3, borderStyle: 'dashed' }}>
                              {values.document1 ? 'Certificate of Incorporation Selected' : 'Upload Certificate of Incorporation'}
                              <input type="file" hidden onChange={(e) => setFieldValue('document1', e.currentTarget.files?.[0])} />
                            </Button>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Button variant="outlined" component="label" fullWidth sx={{ p: 3, borderStyle: 'dashed' }}>
                              {values.document2 ? 'Authorisation Letter Selected' : 'Upload Authorisation Letter'}
                              <input type="file" hidden onChange={(e) => setFieldValue('document2', e.currentTarget.files?.[0])} />
                            </Button>
                          </Grid>
                        </Grid>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                          Supported formats: PDF, JPEG, PNG. Max size: 5MB per file.
                        </Typography>
                      </Box>
                    )}

                    {activeStep === 3 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Review Details</Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Organization Name</Typography>
                            <Typography variant="body1">{values.orgName}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Type</Typography>
                            <Typography variant="body1">{values.orgType}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                            <Typography variant="body1">{values.email}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Typography variant="subtitle2" color="textSecondary">Mobile</Typography>
                            <Typography variant="body1">{values.mobile}</Typography>
                          </Grid>
                        </Grid>
                        <Alert severity="info" sx={{ mt: 4 }}>
                          By submitting this form, you declare that the information provided is true and correct to the best of your knowledge.
                        </Alert>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} variant="outlined">
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                      }}
                    >
                      {isSubmitting ? 'Processing...' : (isLastStep ? 'Submit Application' : 'Next Step')}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
