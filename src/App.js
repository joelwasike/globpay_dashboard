import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BulkPayments from './pages/BulkPayments';
import Forex from './pages/Forex';
import PaymentLinks from './pages/PaymentLinks';
import WalletTransfers from './pages/WalletTransfers';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="bulk-payments" element={<BulkPayments />} />
          <Route path="forex" element={<Forex />} />
          <Route path="payment-links" element={<PaymentLinks />} />
          <Route path="wallet-transfers" element={<WalletTransfers />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App; 