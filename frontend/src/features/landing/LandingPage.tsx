import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Typography, Grid, Card,
  CardContent, Stack, Chip, Avatar,
} from '@mui/material';
import {
  MedicationOutlined, DevicesOutlined, ScienceOutlined,
  LocalHospitalOutlined, VerifiedOutlined, SearchOutlined,
  AssignmentOutlined, NotificationsActiveOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const features = [
  { icon: <MedicationOutlined />,          title: 'Drug Licensing',        desc: 'Apply for manufacturing and import licences for drugs, vaccines, and biologicals.', color: '#1A3C6E' },
  { icon: <DevicesOutlined />,             title: 'Medical Device Reg.',   desc: 'Register Class A-D medical devices and IVD products seamlessly.', color: '#2563EB' },
  { icon: <ScienceOutlined />,             title: 'Lab Certification',     desc: 'CDTL, RDTL, State and Private lab onboarding and certification.', color: '#00B894' },
  { icon: <LocalHospitalOutlined />,       title: 'Blood Bank Registry',   desc: 'Comprehensive blood bank management with geo-tagging.', color: '#FF6B35' },
  { icon: <VerifiedOutlined />,            title: 'Digital Certificates',  desc: 'Digitally signed certificates with QR verification.', color: '#8B5CF6' },
  { icon: <SearchOutlined />,              title: 'Registry Search',       desc: 'Cross-registry search across all regulated products.', color: '#EC4899' },
  { icon: <AssignmentOutlined />,          title: 'Application Tracking',  desc: 'Real-time status tracking across all workflow stages.', color: '#F59E0B' },
  { icon: <NotificationsActiveOutlined />, title: 'Smart Notifications',   desc: 'Instant alerts for approvals, queries, and certificate issuance.', color: '#10B981' },
];

const stats = [
  { value: '15,000+',   label: 'Licensed Organizations' },
  { value: '2,00,000+', label: 'Registered Drug Products' },
  { value: '50,000+',   label: 'Certificates Issued' },
  { value: '99.9%',     label: 'Uptime SLA' },
];

const MotionBox = motion.create(Box);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#F0F4F8', minHeight: '100vh' }}>

      {/* ─── Navigation ─── */}
      <Box sx={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,60,110,0.1)',
        px: 4, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2, bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: 10 }}>CDSCO</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>DDRS Portal</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Digital Drugs Regulatory System</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Button variant="text" color="primary" size="small">About</Button>
          <Button variant="text" color="primary" size="small">Registries</Button>
          <Button variant="text" color="primary" size="small">Help</Button>
          <Button variant="contained" size="small" onClick={() => navigate('/login')} sx={{ borderRadius: 2 }}>
            Sign In
          </Button>
        </Stack>
      </Box>

      {/* ─── Hero Section ─── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0A1E3F 0%, #1A3C6E 55%, #2563EB 100%)',
        color: 'white', py: { xs: 10, md: 16 }, position: 'relative', overflow: 'hidden',
      }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute', borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            width: [600, 400, 250][i], height: [600, 400, 250][i],
            top: ['-200px', '50%', '10%'][i], right: ['-200px', '80%', '-50px'][i],
          }} />
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label="Government of India · CDSCO · Ministry of Health & Family Welfare"
              sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.15, mb: 3, fontSize: { xs: '2rem', md: '3.5rem' } }}>
              One Platform for<br />
              <Box component="span" sx={{ color: '#FF6B35' }}>All Drug Regulation</Box><br />
              in India
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, mb: 5, maxWidth: 580, fontWeight: 400, lineHeight: 1.8 }}>
              CDSCO's unified digital portal for pharmaceutical licensing, registry management,
              and compliance under the Drugs and Cosmetics Act, 1940.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained" size="large"
                sx={{
                  bgcolor: '#FF6B35', '&:hover': { bgcolor: '#C84C1C' },
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 3,
                }}
                endIcon={<ArrowForward />}
                onClick={() => navigate('/register')}
              >
                Register Your Organization
              </Button>
              <Button
                variant="outlined" size="large"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', px: 4, py: 1.5, borderRadius: 3 }}
                onClick={() => navigate('/login')}
              >
                Sign In to Portal
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* ─── Stats Bar ─── */}
      <Box sx={{ bgcolor: 'white', py: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {stats.map((s, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>{s.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Features Grid ─── */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip label="Platform Capabilities" color="primary" variant="outlined" sx={{ mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Everything You Need, In One Place
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto' }}>
            Streamline every regulatory process across your entire organization lifecycle.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                viewport={{ once: true }}
                sx={{ height: '100%' }}
              >
                <Card sx={{
                  height: '100%',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: f.color + '1A', color: f.color, mb: 2, width: 48, height: 48 }}>
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── CTA Banner ─── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1A3C6E 0%, #2563EB 100%)',
        color: 'white', py: 10, textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Streamline Your Regulatory Journey?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 5 }}>
            Join thousands of pharmaceutical companies, device manufacturers and importers
            on India's premier regulatory platform.
          </Typography>
          <Button
            variant="contained" size="large"
            sx={{ bgcolor: '#FF6B35', '&:hover': { bgcolor: '#C84C1C' }, px: 6, py: 1.5, borderRadius: 3, fontWeight: 700 }}
            onClick={() => navigate('/register')}
          >
            Get Started — It's Free
          </Button>
        </Container>
      </Box>

      {/* ─── Footer ─── */}
      <Box sx={{ bgcolor: '#0A1E3F', color: 'rgba(255,255,255,0.6)', py: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2026 Central Drugs Standard Control Organisation (CDSCO), Directorate General of Health Services,<br />
          Ministry of Health &amp; Family Welfare, Government of India. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.5 }}>
          Powered by Digital Public Infrastructure (DPI) | Built on Digital Public Goods (DPG)
        </Typography>
      </Box>
    </Box>
  );
};
