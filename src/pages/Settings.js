import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  KeyIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [settings, setSettings] = useState({
    blockchainAnchoring: true,
    kycEnabled: true,
    amlEnabled: true,
    fscaCompliance: true,
    rmcpCompliance: true,
    auditLogging: true,
    twoFactorAuth: true,
    sessionTimeout: 30,
    encryptionLevel: 'high'
  });

  const [apiTokens, setApiTokens] = useState([]);
  const [showGenerateToken, setShowGenerateToken] = useState(false);
  const [newToken, setNewToken] = useState({
    name: '',
    permissions: [],
    expiryDays: 30
  });

  const [complianceStatus, setComplianceStatus] = useState({
    fsca: { status: 'compliant', lastCheck: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    rmcp: { status: 'compliant', lastCheck: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    aml: { status: 'compliant', lastCheck: new Date(Date.now() - 1000 * 60 * 60 * 12) },
    kyc: { status: 'compliant', lastCheck: new Date(Date.now() - 1000 * 60 * 60 * 6) }
  });

  useEffect(() => {
    // Mock API tokens
    setApiTokens([
      {
        id: 1,
        name: 'Production API Token',
        token: 'sk_prod_1234567890abcdef',
        permissions: ['read', 'write'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'active'
      },
      {
        id: 2,
        name: 'Development API Token',
        token: 'sk_dev_abcdef1234567890',
        permissions: ['read'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'active'
      }
    ]);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateApiToken = (e) => {
    e.preventDefault();
    const token = {
      id: Date.now(),
      name: newToken.name,
      token: `sk_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
      permissions: newToken.permissions,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + newToken.expiryDays * 24 * 60 * 60 * 1000),
      lastUsed: null,
      status: 'active'
    };
    setApiTokens(prev => [...prev, token]);
    setShowGenerateToken(false);
    setNewToken({ name: '', permissions: [], expiryDays: 30 });
  };

  const revokeApiToken = (tokenId) => {
    if (window.confirm('Are you sure you want to revoke this API token?')) {
      setApiTokens(prev => prev.map(token => 
        token.id === tokenId ? { ...token, status: 'revoked' } : token
      ));
    }
  };

  const getComplianceStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />;
      case 'non-compliant':
        return <ExclamationTriangleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-success-100 text-success-800';
      case 'warning':
        return 'bg-warning-100 text-warning-800';
      case 'non-compliant':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Compliance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure vault security, compliance, and API settings
        </p>
      </div>

      {/* Security Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          Security Settings
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.blockchainAnchoring}
                  onChange={(e) => handleSettingChange('blockchainAnchoring', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Blockchain Anchoring</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Anchor all transactions to blockchain for immutability</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Require 2FA for all user accounts</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Audit Logging</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Log all user actions for compliance</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="input-field"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Level</label>
            <select
              value={settings.encryptionLevel}
              onChange={(e) => handleSettingChange('encryptionLevel', e.target.value)}
              className="input-field"
            >
              <option value="standard">Standard (AES-256)</option>
              <option value="high">High (AES-256 + Blockchain Anchoring)</option>
              <option value="military">Military Grade (Quantum-Resistant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Compliance Settings
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.kycEnabled}
                  onChange={(e) => handleSettingChange('kycEnabled', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">KYC Verification</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Enable Know Your Customer verification</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.amlEnabled}
                  onChange={(e) => handleSettingChange('amlEnabled', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">AML Monitoring</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Enable Anti-Money Laundering monitoring</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.fscaCompliance}
                  onChange={(e) => handleSettingChange('fscaCompliance', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">FSCA Compliance</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Financial Sector Conduct Authority compliance</p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.rmcpCompliance}
                  onChange={(e) => handleSettingChange('rmcpCompliance', e.target.checked)}
                  className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">RMCP Compliance</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">Risk Management and Compliance Program</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(complianceStatus).map(([key, status]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 uppercase">{key}</span>
                {getComplianceStatusIcon(status.status)}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceStatusColor(status.status)}`}>
                {status.status}
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Last check: {status.lastCheck.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* API Token Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            API Token Management
          </h3>
          <button
            onClick={() => setShowGenerateToken(true)}
            className="btn-primary"
          >
            Generate New Token
          </button>
        </div>

        <div className="space-y-4">
          {apiTokens.map((token) => (
            <div key={token.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{token.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      token.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {token.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Permissions: {token.permissions.join(', ')}</span>
                    <span>Created: {token.createdAt.toLocaleDateString()}</span>
                    <span>Expires: {token.expiresAt.toLocaleDateString()}</span>
                    {token.lastUsed && (
                      <span>Last used: {token.lastUsed.toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {token.token.substring(0, 20)}...
                    </code>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => revokeApiToken(token.id)}
                    className="text-danger-600 hover:text-danger-900 text-sm"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Token Modal */}
      {showGenerateToken && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate API Token</h3>
              <form onSubmit={generateApiToken} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
                  <input
                    type="text"
                    value={newToken.name}
                    onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Production API"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                  <div className="space-y-2">
                    {['read', 'write', 'admin'].map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newToken.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewToken(prev => ({ ...prev, permissions: [...prev.permissions, permission] }));
                            } else {
                              setNewToken(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
                            }
                          }}
                          className="h-4 w-4 text-[#015F6B] focus:ring-[#015F6B] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (days)</label>
                  <select
                    value={newToken.expiryDays}
                    onChange={(e) => setNewToken(prev => ({ ...prev, expiryDays: parseInt(e.target.value) }))}
                    className="input-field"
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateToken(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Generate Token
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 