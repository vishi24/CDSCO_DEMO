import React, { useState } from 'react';
import {
  Box, Typography, Stepper, Step, StepLabel, Button, Paper, TextField, MenuItem,
  useTheme, Alert, Grid, Checkbox, FormControlLabel
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OtpVerificationStep } from './OtpVerificationStep';
import { ProfileDetailsStep } from './ProfileDetailsStep';

const steps = [
  'Organization Details', 
  'Authorised Signatory', 
  'Contact & Credentials', 
  'OTP Verification',
  'Profile Details',
  'Review & Submit'
];

const validationSchemas = [
  // Step 1: Org Details
  Yup.object({
    orgType: Yup.string().required('Organization type is required'),
    orgName: Yup.string().required('Organization name is required'),
    cinLlpin: Yup.string().required('CIN / LLPIN is required'),
    panNumber: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN').required('PAN is required'),
    gstNumber: Yup.string().required('GST Number is required'),
    city: Yup.string().required('City is required'),
    stateCode: Yup.string().required('State is required'),
  }),
  // Step 2: Signatory
  Yup.object({
    contactPersonName: Yup.string().required('Signatory name is required'),
    contactPersonDesignation: Yup.string().required('Designation is required'),
    aadhaarToken: Yup.string().matches(/^\d{12}$/, 'Must be 12 digits').required('Aadhaar is required'),
  }),
  // Step 3: Contact & Creds
  Yup.object({
    mobile: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Mobile is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Min 8 chars').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password'),
    captcha: Yup.string().required('Captcha is required')
  }),
  // Step 4: OTP - No yup validation, handled internally
  Yup.object({}),
  // Step 5: Profile Details
  Yup.object({
    fullName: Yup.string().required('Full name is required'),
    dateOfBirth: Yup.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Must be 18+').required('Required'),
    nationality: Yup.string().required('Nationality is required'),
  }),
  // Step 6: Review & Submit
  Yup.object({
    declaration: Yup.boolean().oneOf([true], 'You must accept the declaration to submit')
  })
];

const initialValues = {
  orgType: '', orgName: '', cinLlpin: '', panNumber: '', gstNumber: '', city: '', stateCode: '',
  contactPersonName: '', contactPersonDesignation: '', aadhaarToken: '', alternateMobile: '', alternateEmail: '',
  mobile: '', email: '', password: '', confirmPassword: '', captcha: '',
  fullName: '', fatherSpouseName: '', dateOfBirth: '', nationality: 'INDIAN', experienceYears: '', qualification: '', pharmacistRegNo: '', profilePhoto: null,
  declaration: false
};

const RegistrationPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [otpVerified, setOtpVerified] = useState(false);

  const isLastStep = activeStep === steps.length - 1;

  const submitForm = async (values: any, actions: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await axios.post('/api/v1/organizations/register', values);
      // FAKE NOTIFICATION BANNER SHOWN VIA SNACKBAR LATER
      navigate('/register/success', { state: { orgCode: response.data.orgCode, ddrsUserId: `DDRS/${new Date().getFullYear()}/00012345` } });
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  const handleNext = (values: any, actions: any) => {
    if (activeStep === 2) {
      // Before moving to OTP step, send the OTPs
      axios.post('/api/v1/auth/otp/send-mobile', { mobile: values.mobile }).catch(console.error);
      axios.post('/api/v1/auth/otp/send-email', { email: values.email }).catch(console.error);
    }
    
    if (activeStep === 3 && !otpVerified) {
      alert("Please verify both Mobile and Email OTPs to proceed.");
      actions.setSubmitting(false);
      return;
    }

    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 6, px: 2, background: theme.palette.background.default }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 4, textAlign: 'center' }}>
              DDRS Organization Registration
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

            {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}

            <Formik initialValues={initialValues} validationSchema={validationSchemas[activeStep]} onSubmit={handleNext}>
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <Box sx={{ minHeight: 350 }}>
                    {/* STEP 1: Org Details */}
                    {activeStep === 0 && (
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} select fullWidth name="orgType" label="User Type (Organization)"
                            error={touched.orgType && !!errors.orgType} helperText={touched.orgType && (errors.orgType as string)}>
                            <MenuItem value="MANUFACTURER">Manufacturer</MenuItem>
                            <MenuItem value="IMPORTER">Importer</MenuItem>
                            <MenuItem value="CRO">Clinical Research Org (CRO)</MenuItem>
                            <MenuItem value="ETHICS_COMMITTEE">Ethics Committee</MenuItem>
                            <MenuItem value="LAB">Testing Laboratory</MenuItem>
                            <MenuItem value="DISTRIBUTOR">Distributor / Wholesaler</MenuItem>
                            <MenuItem value="RETAILER">Retail Pharmacy</MenuItem>
                          </Field>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="orgName" label="Organization Name"
                            error={touched.orgName && !!errors.orgName} helperText={touched.orgName && (errors.orgName as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="cinLlpin" label="CIN / LLPIN"
                            error={touched.cinLlpin && !!errors.cinLlpin} helperText={touched.cinLlpin && (errors.cinLlpin as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="panNumber" label="PAN Number"
                            error={touched.panNumber && !!errors.panNumber} helperText={touched.panNumber && (errors.panNumber as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Field as={TextField} fullWidth name="gstNumber" label="GST Number"
                            error={touched.gstNumber && !!errors.gstNumber} helperText={touched.gstNumber && (errors.gstNumber as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Field as={TextField} fullWidth name="city" label="City"
                            error={touched.city && !!errors.city} helperText={touched.city && (errors.city as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Field as={TextField} fullWidth name="stateCode" label="State"
                            error={touched.stateCode && !!errors.stateCode} helperText={touched.stateCode && (errors.stateCode as string)} />
                        </Grid>
                      </Grid>
                    )}

                    {/* STEP 2: Signatory */}
                    {activeStep === 1 && (
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="contactPersonName" label="Authorised Signatory Name"
                            error={touched.contactPersonName && !!errors.contactPersonName} helperText={touched.contactPersonName && (errors.contactPersonName as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="contactPersonDesignation" label="Designation"
                            error={touched.contactPersonDesignation && !!errors.contactPersonDesignation} helperText={touched.contactPersonDesignation && (errors.contactPersonDesignation as string)} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field as={TextField} fullWidth name="aadhaarToken" label="Aadhaar Number (12 digits)" type="password"
                            error={touched.aadhaarToken && !!errors.aadhaarToken} helperText={touched.aadhaarToken && (errors.aadhaarToken as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="alternateMobile" label="Alternate Mobile (Optional)" />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="alternateEmail" label="Alternate Email (Optional)" />
                        </Grid>
                      </Grid>
                    )}

                    {/* STEP 3: Contact & Creds */}
                    {activeStep === 2 && (
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="mobile" label="Primary Mobile Number"
                            error={touched.mobile && !!errors.mobile} helperText={touched.mobile && (errors.mobile as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="email" label="Primary Email ID"
                            error={touched.email && !!errors.email} helperText={touched.email && (errors.email as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="password" label="Password" type="password"
                            error={touched.password && !!errors.password} helperText={touched.password && (errors.password as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Field as={TextField} fullWidth name="confirmPassword" label="Confirm Password" type="password"
                            error={touched.confirmPassword && !!errors.confirmPassword} helperText={touched.confirmPassword && (errors.confirmPassword as string)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ bgcolor: '#f0f0f0', p: 1, letterSpacing: 3 }}>3 + 7 = ?</Typography>
                          <Field as={TextField} name="captcha" label="Solve Captcha"
                            error={touched.captcha && !!errors.captcha} helperText={touched.captcha && (errors.captcha as string)} />
                        </Grid>
                      </Grid>
                    )}

                    {/* STEP 4: OTP Verification */}
                    {activeStep === 3 && (
                      <OtpVerificationStep 
                        mobile={values.mobile} 
                        email={values.email} 
                        onVerified={() => setOtpVerified(true)} 
                      />
                    )}

                    {/* STEP 5: Profile Details */}
                    {activeStep === 4 && (
                      <ProfileDetailsStep 
                        values={values} 
                        errors={errors} 
                        touched={touched} 
                        setFieldValue={setFieldValue} 
                      />
                    )}

                    {/* STEP 6: Review & Submit */}
                    {activeStep === 5 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>Review Details</Typography>
                        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="textSecondary">Organization Type</Typography><Typography>{values.orgType}</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="textSecondary">Organization Name</Typography><Typography>{values.orgName}</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="textSecondary">Email</Typography><Typography>{values.email}</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="textSecondary">Mobile</Typography><Typography>{values.mobile}</Typography></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Typography variant="subtitle2" color="textSecondary">Signatory Name</Typography><Typography>{values.contactPersonName}</Typography></Grid>
                          </Grid>
                        </Paper>
                        
                        <Alert severity="info" sx={{ mb: 3 }}>
                          On submission, your unique DDRS User ID will be generated.
                        </Alert>

                        <FormControlLabel
                          control={<Field as={Checkbox} name="declaration" color="primary" />}
                          label="I hereby declare that the information given above is true and correct to the best of my knowledge."
                        />
                        {touched.declaration && errors.declaration && (
                          <Typography color="error" variant="caption" sx={{ display: 'block' }}>{errors.declaration as string}</Typography>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack} variant="outlined">Back</Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || (activeStep === 3 && !otpVerified)}
                      sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)` }}
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
