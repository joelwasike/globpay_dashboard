import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const VaultOperations = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [depositForm, setDepositForm] = useState({
    assetType: 'fiat',
    currency: 'USD',
    amount: '',
    description: '',
    encryptionLevel: 'high'
  });
  const [retrieveForm, setRetrieveForm] = useState({
    assetType: 'fiat',
    currency: 'USD',
    amount: '',
    reason: '',
    destination: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    setUploadStatus('uploading');
    
    // Simulate file upload
    setTimeout(() => {
      const newFiles = acceptedFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'encrypted',
        uploadedAt: new Date()
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setUploadStatus('completed');
      toast.success(`${acceptedFiles.length} file(s) uploaded and encrypted successfully`);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositForm.amount || !depositForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Deposit initiated successfully');
    setDepositForm({
      assetType: 'fiat',
      currency: 'USD',
      amount: '',
      description: '',
      encryptionLevel: 'high'
    });
  };

  const handleRetrieve = (e) => {
    e.preventDefault();
    if (!retrieveForm.amount || !retrieveForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Retrieval request submitted for approval');
    setRetrieveForm({
      assetType: 'fiat',
      currency: 'USD',
      amount: '',
      reason: '',
      destination: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'encrypted':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
      case 'uploading':
        return <ClockIcon className="h-5 w-5 text-warning-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-danger-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vault Operations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Deposit, retrieve, and manage secure assets and documents
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'deposit', name: 'Deposit Assets', icon: ArrowDownTrayIcon },
            { id: 'retrieve', name: 'Retrieve Assets', icon: ArrowUpTrayIcon },
            { id: 'documents', name: 'Secure Documents', icon: DocumentTextIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-vault-500 text-vault-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'deposit' && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deposit Assets</h3>
            <form onSubmit={handleDeposit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={depositForm.assetType}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, assetType: e.target.value }))}
                    className="input-field"
                  >
                    <option value="fiat">Fiat Currency</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="precious_metals">Precious Metals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency/Asset
                  </label>
                  <select
                    value={depositForm.currency}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="input-field"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={depositForm.description}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Describe the purpose of this deposit"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption Level
                </label>
                <select
                  value={depositForm.encryptionLevel}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, encryptionLevel: e.target.value }))}
                  className="input-field"
                >
                  <option value="standard">Standard (AES-256)</option>
                  <option value="high">High (AES-256 + Blockchain Anchoring)</option>
                  <option value="military">Military Grade (Quantum-Resistant)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Initiate Deposit
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'retrieve' && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Retrieve Assets</h3>
            <form onSubmit={handleRetrieve} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Type
                  </label>
                  <select
                    value={retrieveForm.assetType}
                    onChange={(e) => setRetrieveForm(prev => ({ ...prev, assetType: e.target.value }))}
                    className="input-field"
                  >
                    <option value="fiat">Fiat Currency</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="precious_metals">Precious Metals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency/Asset
                  </label>
                  <select
                    value={retrieveForm.currency}
                    onChange={(e) => setRetrieveForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={retrieveForm.amount}
                  onChange={(e) => setRetrieveForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="input-field"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Retrieval
                </label>
                <textarea
                  value={retrieveForm.reason}
                  onChange={(e) => setRetrieveForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Explain the reason for this retrieval request"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address/Account
                </label>
                <input
                  type="text"
                  value={retrieveForm.destination}
                  onChange={(e) => setRetrieveForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="input-field"
                  placeholder="Enter destination address or account number"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Retrieval Request
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Secure Documents</h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-vault-500 bg-vault-50'
                    : 'border-gray-300 hover:border-vault-400'
                }`}
              >
                <input {...getInputProps()} />
                <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to select files (PDF, DOCX, TXT, JSON up to 10MB)
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <LockClosedIcon className="h-4 w-4" />
                    <span>End-to-end encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Blockchain anchored</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-8 w-8 text-vault-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <span className="text-xs text-gray-500">
                          {file.uploadedAt.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultOperations; 