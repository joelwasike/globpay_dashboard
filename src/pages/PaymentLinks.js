import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LinkIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const PaymentLinks = () => {
  const { api, user } = useAuth();
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'M-PESA',
    amount: '',
    merchant: user?.merchantID || '',
    token: ''
  });

  useEffect(() => {
    loadPaymentLinks();
  }, []);

  const loadPaymentLinks = async () => {
    try {
      setLoading(true);
      // Mock data for demo since there's no list endpoint in the API
      setPaymentLinks([
        {
          id: 1,
          type: 'M-PESA',
          amount: 5000,
          merchant: user?.merchantID,
          token: 'MzZmMGJkODJiNWYxNGIyZjIxZTkyZDdiMDAzMDcyZTg=',
          status: 'active',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          url: 'https://payment.example.com/pay/MzZmMGJkODJiNWYxNGIyZjIxZTkyZDdiMDAzMDcyZTg='
        },
        {
          id: 2,
          type: 'CARD',
          amount: 10000,
          merchant: user?.merchantID,
          token: 'YzZmMGJkODJiNWYxNGIyZjIxZTkyZDdiMDAzMDcyZTg=',
          status: 'expired',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          url: 'https://payment.example.com/pay/YzZmMGJkODJiNWYxNGIyZjIxZTkyZDdiMDAzMDcyZTg='
        }
      ]);
    } catch (error) {
      console.error('Error loading payment links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentLink = async () => {
    try {
      const response = await api.post('/api/links/generate', formData);
      if (response.data) {
        setShowCreateForm(false);
        setFormData({
          type: 'M-PESA',
          amount: '',
          merchant: user?.merchantID || '',
          token: ''
        });
        loadPaymentLinks();
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };

  const handleProcessPayment = async (linkData) => {
    try {
      const processData = {
        token: linkData.token,
        impalaMerchantId: linkData.merchant,
        currency: 'KES',
        amount: linkData.amount,
        payerPhone: '254794940160',
        mobileMoneySP: linkData.type,
        externalId: `PaymentLink${linkData.id}`,
        callbackUrl: 'https://webhook.site/9878e703-812c-4b66-b9b2-68bc3e9d46bb'
      };

      const response = await api.post('/api/links/process', processData);
      if (response.data) {
        alert('Payment processed successfully!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#015F6B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage shareable payment links for your customers
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#015F6B] hover:bg-[#00B7AA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015F6B]"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Generate Payment Link
        </button>
      </div>

      {/* Payment Links Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paymentLinks.map((link) => (
          <div key={link.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <LinkIcon className="h-6 w-6 text-[#015F6B]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Payment Link
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {link.type}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium text-gray-900">
                    {link.amount?.toLocaleString()} KES
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="flex items-center">
                    {getStatusIcon(link.status)}
                    <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
                      {link.status}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-xs text-gray-500">
                    {link.createdAt?.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={link.url}
                    readOnly
                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 bg-gray-100"
                  />
                  <button
                    onClick={() => copyToClipboard(link.url)}
                    className="text-[#015F6B] hover:text-[#00B7AA]"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleProcessPayment(link)}
                    className="flex-1 px-3 py-1 bg-[#015F6B] text-white text-xs rounded hover:bg-[#00B7AA]"
                  >
                    Process Payment
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Generate Payment Link
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="M-PESA">M-PESA</option>
                    <option value="CARD">Card Payment</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Merchant ID</label>
                  <input
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Merchant ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Token (Optional)</label>
                  <input
                    type="text"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Custom token"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaymentLink}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Link Statistics</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <LinkIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Links</p>
                <p className="text-2xl font-semibold text-blue-900">{paymentLinks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Active Links</p>
                <p className="text-2xl font-semibold text-green-900">
                  {paymentLinks.filter(link => link.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Total Value</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {paymentLinks.reduce((sum, link) => sum + (link.amount || 0), 0).toLocaleString()} KES
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLinks;
