import React, { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface LocationData {
  lat: number;
  lng: number;
}

interface GeotagCaptureProps {
  onCapture: (location: LocationData) => void;
}

export const GeotagCapture: React.FC<GeotagCaptureProps> = ({ onCapture }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(loc);
          setLoading(false);
          onCapture(loc);
        },
        (err) => {
          console.error(err);
          // Fallback to CDSCO HQ coordinates if blocked or unavailable in demo
          const loc = { lat: 28.6366, lng: 77.2346 }; 
          setLocation(loc);
          setLoading(false);
          onCapture(loc);
          setError("Using fallback CDSCO HQ location (Demo).");
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Geotag & Media Capture</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<LocationOnIcon />}
          onClick={captureLocation}
          disabled={loading}
        >
          Capture GPS Location
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CameraAltIcon />}
          component="label"
        >
          Capture Site Photo
          <input type="file" hidden accept="image/*" capture="environment" />
        </Button>
      </Box>

      {loading && <CircularProgress size={24} />}
      
      {location && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Location Captured: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
        </Alert>
      )}

      {error && (
        <Alert severity="info">{error}</Alert>
      )}
    </Paper>
  );
};
