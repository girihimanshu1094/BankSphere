import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankDataProvider } from './context/BankDataContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyAccountPage from './pages/customer/MyAccountPage';
import TransferMoneyPage from './pages/customer/TransferMoneyPage';
import TransactionsPage from './pages/customer/TransactionsPage';
import BeneficiariesPage from './pages/customer/BeneficiariesPage';
import LoansPage from './pages/customer/LoansPage';
import ComplaintsPage from './pages/customer/ComplaintsPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import ProfilePage from './pages/customer/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminLoansPage from './pages/admin/AdminLoansPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Common
import NotFoundPage from './pages/NotFoundPage';

// Root redirector based on authentication
const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BankDataProvider>
          <Routes>
            {/* Root Route */}
            <Route path="/" element={<RootRedirect />} />

            {/* Authentication Flow */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Customer NetBanking Portal */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="my-account" element={<MyAccountPage />} />
              <Route path="transfer" element={<TransferMoneyPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="beneficiaries" element={<BeneficiariesPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Bank Administrator Command Center */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="accounts" element={<AdminAccountsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="loans" element={<AdminLoansPage />} />
              <Route path="complaints" element={<AdminComplaintsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BankDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
