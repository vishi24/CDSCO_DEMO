import React from 'react';
import { Box, Typography, TextField, Grid, MenuItem, Button } from '@mui/material';
import { Field } from 'formik';
import type { FormikErrors, FormikTouched } from 'formik';

interface ProfileDetailsStepProps {
  values: any;
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const ProfileDetailsStep: React.FC<ProfileDetailsStepProps> = ({
  values,
  errors,
  touched,
  setFieldValue
}) => {
  return (
    <Box sx={{ minHeight: 300 }}>
      <Typography variant="h6" gutterBottom>Applicant Profile Details</Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Field as={TextField} fullWidth name="fullName" label="Full Name of Applicant"
            error={touched.fullName && !!errors.fullName} 
            helperText={touched.fullName && (errors.fullName as string)} />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Field as={TextField} fullWidth name="fatherSpouseName" label="Father's / Spouse Name"
            error={touched.fatherSpouseName && !!errors.fatherSpouseName} 
            helperText={touched.fatherSpouseName && (errors.fatherSpouseName as string)} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Field as={TextField} fullWidth type="date" name="dateOfBirth" label="Date of Birth"
            InputLabelProps={{ shrink: true }}
            error={touched.dateOfBirth && !!errors.dateOfBirth} 
            helperText={touched.dateOfBirth && (errors.dateOfBirth as string)} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Field as={TextField} select fullWidth name="nationality" label="Nationality"
            error={touched.nationality && !!errors.nationality} 
            helperText={touched.nationality && (errors.nationality as string)}>
            <MenuItem value="INDIAN">Indian</MenuItem>
            <MenuItem value="NRI">NRI</MenuItem>
            <MenuItem value="FOREIGN">Foreign National</MenuItem>
          </Field>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Field as={TextField} fullWidth type="number" name="experienceYears" label="Experience (Years)"
            error={touched.experienceYears && !!errors.experienceYears} 
            helperText={touched.experienceYears && (errors.experienceYears as string)} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Field as={TextField} fullWidth name="qualification" label="Highest Qualification"
            error={touched.qualification && !!errors.qualification} 
            helperText={touched.qualification && (errors.qualification as string)} />
        </Grid>

        {['RETAILER', 'DISTRIBUTOR', 'MANUFACTURER'].includes(values.orgType) && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Field as={TextField} fullWidth name="pharmacistRegNo" label="Pharmacist Registration No."
              error={touched.pharmacistRegNo && !!errors.pharmacistRegNo} 
              helperText={touched.pharmacistRegNo && (errors.pharmacistRegNo as string)} />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Profile Photo</Typography>
            <Button variant="outlined" component="label">
              {values.profilePhoto ? 'Photo Selected' : 'Upload Photo (JPG/PNG)'}
              <input type="file" hidden accept="image/jpeg, image/png" 
                onChange={(e) => setFieldValue('profilePhoto', e.currentTarget.files?.[0])} />
            </Button>
            {values.profilePhoto && (
              <Typography variant="caption" sx={{ ml: 2, color: 'success.main' }}>
                {(values.profilePhoto as File).name}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
