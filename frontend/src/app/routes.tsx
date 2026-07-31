import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { AppHeader } from '../components/common/AppHeader/AppHeader';
import { LoginPage } from '../features/auth/LoginPage';
import { LandingPage } from '../features/landing/LandingPage';
import RegistrationPage from '../features/registration/RegistrationPage';
import RegistrationSuccess from '../features/registration/RegistrationSuccess';
import OfficerDashboard from '../features/officer/dashboard/OfficerDashboard';
import { AdminDashboard } from '../features/admin/dashboard/AdminDashboard';
import { MasterDataManagement } from '../features/admin/MasterDataManagement';
import { AuditLogs } from '../features/admin/audit/AuditLogs';
import { UserManagement } from '../features/admin/users/UserManagement';
import RegistrationReview from '../features/officer/registrations/RegistrationReview';
import { ApplicationList } from '../features/industry/applications/ApplicationList';
import { NewApplication } from '../features/industry/applications/NewApplication';
import { ApplicationQueue } from '../features/officer/applications/ApplicationQueue';
import { ApplicationReview } from '../features/officer/applications/ApplicationReview';
import { CertificateList } from '../features/industry/certificates/CertificateList';
import { RegistrySearch } from '../features/officer/registry/RegistrySearch';
import { DemoPanel } from '../features/demo/DemoPanel';
import IndustryDashboard from '../features/industry/dashboard/IndustryDashboard';
import type { RootState } from './store';

// Other placeholder pages
const UnauthorizedPage   = () => <Box sx={{ p: 4 }}><Typography variant="h5" color="error">403 — Unauthorized Access</Typography></Box>;
const NotFoundPage       = () => <Box sx={{ p: 4 }}><Typography variant="h5">404 — Page Not Found</Typography></Box>;

/** Role-based route guard */
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactElement;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AppHeader />
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/register/success" element={<RegistrationSuccess />} />

      {/* Industry */}
      <Route
        path="/industry/*"
        element={
          <ProtectedRoute allowedRoles={['INDUSTRY']}>
            <Routes>
              <Route path="dashboard"   element={<IndustryDashboard />} />
              <Route path="applications" element={<ApplicationList />} />
              <Route path="applications/new" element={<NewApplication />} />
              <Route path="certificates" element={<CertificateList />} />
              <Route path="*"           element={<NotFoundPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* CDSCO Officer / Senior */}
      <Route
        path="/officer/*"
        element={
          <ProtectedRoute allowedRoles={['CDSCO_OFFICER', 'CDSCO_SENIOR']}>
            <Routes>
              <Route path="dashboard"       element={<OfficerDashboard />} />
              <Route path="registrations"   element={<RegistrationReview />} />
              <Route path="applications"    element={<ApplicationQueue />} />
              <Route path="applications/:id" element={<ApplicationReview />} />
              <Route path="registry"        element={<RegistrySearch />} />
              <Route path="*"               element={<NotFoundPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Routes>
              <Route path="dashboard"   element={<AdminDashboard />} />
              <Route path="master-data" element={<MasterDataManagement />} />
              <Route path="audit"       element={<AuditLogs />} />
              <Route path="users"       element={<UserManagement />} />
              <Route path="*"           element={<NotFoundPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Demo Panel (Hidden) */}
      <Route
        path="/demo"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DemoPanel />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*"             element={<NotFoundPage />} />
    </Routes>
  );
};
