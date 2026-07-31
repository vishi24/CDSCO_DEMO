import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Stepper, Step, StepLabel, 
  Button, TextField, MenuItem, useTheme, Alert, Grid
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const steps = ['Basic Info', 'Product Details', 'Upload Documents', 'Review & Submit'];

const validationSchemas = [
  Yup.object({
    licenceType: Yup.string().required('Licence type is required'),
    subCategory: Yup.string().required('Sub-category is required'),
  }),
  Yup.object({
    productName: Yup.string().required('Product name is required'),
  }),
  Yup.object({
    document1: Yup.mixed().required('Technical specifications document is required'),
  }),
  Yup.object({})
];

export const NewApplication: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (values: any, actions: any) => {
    if (activeStep === steps.length - 1) {
      // Final Submit
      try {
        await axios.post('/api/v1/applications', {
          organizationId: '00000000-0000-0000-0000-000000000001',
          licenceType: values.licenceType,
          subCategory: values.subCategory
        });
        actions.setSubmitting(false);
        navigate('/industry/applications');
      } catch (err) {
        console.error(err);
        actions.setSubmitting(false);
      }
    } else {
      handleNext();
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
        New Licence Application
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Formik
            initialValues={{
              licenceType: '',
              subCategory: '',
              productName: '',
              document1: null
            }}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, setFieldValue, isSubmitting }) => (
              <Form>
                <Box sx={{ minHeight: 300 }}>
                  {activeStep === 0 && (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} select fullWidth name="licenceType" label="Licence Type"
                          error={touched.licenceType && !!errors.licenceType} helperText={touched.licenceType && (errors.licenceType as string)}>
                          <MenuItem value="DRUG_MANUFACTURING">Drug Manufacturing (Form 25/28)</MenuItem>
                          <MenuItem value="MEDICAL_DEVICE">Medical Device (MD-5/MD-9)</MenuItem>
                          <MenuItem value="BLOOD_BANK">Blood Bank (Form 27C)</MenuItem>
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Field as={TextField} fullWidth name="subCategory" label="Sub Category"
                          error={touched.subCategory && !!errors.subCategory} helperText={touched.subCategory && (errors.subCategory as string)} />
                      </Grid>
                    </Grid>
                  )}

                  {activeStep === 1 && (
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Field as={TextField} fullWidth name="productName" label="Product Name / Brand Name"
                          error={touched.productName && !!errors.productName} helperText={touched.productName && (errors.productName as string)} />
                      </Grid>
                    </Grid>
                  )}

                  {activeStep === 2 && (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>Upload supporting technical documents (PDF only).</Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <Button variant="outlined" component="label" fullWidth sx={{ p: 3, borderStyle: 'dashed' }}>
                            {values.document1 ? 'Technical Specs Selected' : 'Upload Technical Specs (Mandatory)'}
                            <input type="file" hidden onChange={(e) => setFieldValue('document1', e.currentTarget.files?.[0])} />
                          </Button>
                          {touched.document1 && errors.document1 && (
                            <Typography color="error" variant="caption">{errors.document1 as string}</Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {activeStep === 3 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>Review details before submission</Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="subtitle2" color="textSecondary">Licence Type</Typography>
                          <Typography variant="body1">{values.licenceType}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="subtitle2" color="textSecondary">Product Name</Typography>
                          <Typography variant="body1">{values.productName}</Typography>
                        </Grid>
                      </Grid>
                      <Alert severity="info" sx={{ mt: 4 }}>
                        By submitting, you confirm that all technical specifications and documents are genuine and comply with CDSCO regulations.
                      </Alert>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                    Back
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {activeStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit Application') : 'Next'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};
