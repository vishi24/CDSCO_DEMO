import React from 'react';
import {
  Box, Typography, Paper, Stepper, Step, StepLabel, StepContent, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

interface ApplicationTimelineProps {
  events: TimelineEvent[];
  currentStatus?: string;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ events, currentStatus }) => {
  const activeIndex = events.findIndex(e => !e.completed);
  const activeStep = activeIndex === -1 ? events.length : activeIndex;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">Application Journey</Typography>
        {currentStatus && (
          <Chip
            label={currentStatus.replace(/_/g, ' ')}
            color={currentStatus === 'APPROVED' ? 'success' : currentStatus === 'REJECTED' ? 'error' : 'warning'}
            size="small"
          />
        )}
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {events.map((event, index) => (
          <Step key={index} completed={event.completed}>
            <StepLabel
              icon={event.completed
                ? <CheckCircleIcon color="success" fontSize="small" />
                : <RadioButtonUncheckedIcon color="disabled" fontSize="small" />}
              optional={
                <Typography variant="caption" color={event.completed ? 'textSecondary' : 'disabled'}>
                  {event.date}
                </Typography>
              }
            >
              <Typography
                variant="body2"
                
                color={event.completed ? 'textPrimary' : 'textSecondary'}
               sx={{ fontWeight: event.completed ? 600 : 400 }}>
                {event.status}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="caption" color="textSecondary">
                {event.description}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};
