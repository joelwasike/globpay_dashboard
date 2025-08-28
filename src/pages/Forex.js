import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  CurrencyDollarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Forex = () => {
  const { api } = useAuth();
  const [forexRates, setForexRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    currencyCode: '',
    conversionRate: '',
    supported: 1
  });

  useEffect(() => {
    loadForexRates();
  }, []);

  const loadForexRates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/forex/list');
      if (response.data && response.data.forexRates) {
        setForexRates(response.data.forexRates);
      } else {
        // Mock data for demo
        setForexRates([
          {
            id: 1,
            currencyCode: 'USD',
            currencyName: 'United States Dollar',
            conversionRate: 1.0,
            supported: 1,
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24)
          },
          {
            id: 2,
            currencyCode: 'EUR',
            currencyName: 'Euro',
            conversionRate: 0.85,
            supported: 1,
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12)
          },
          {
            id: 3,
            currencyCode: 'GBP',
            currencyName: 'British Pound',
            conversionRate: 0.73,
            supported: 1,
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6)
          },
          {
            id: 4,
            currencyCode: 'KES',
            currencyName: 'Kenyan Shilling',
            conversionRate: 150.25,
            supported: 1,
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2)
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading forex rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForexRate = async () => {
    try {
      const response = await api.post('/api/forex/create', {
        Forex: formData
      });
      if (response.data) {
        setShowCreateForm(false);
        setFormData({
          currencyCode: '',
          conversionRate: '',
          supported: 1
        });
        loadForexRates();
      }
    } catch (error) {
      console.error('Error creating forex rate:', error);
    }
  };

  const handleUpdateForexRate = async () => {
    try {
      const response = await api.put(`/api/forex/update/${editingRate.id}`, formData);
      if (response.data) {
        setEditingRate(null);
        setFormData({
          currencyCode: '',
          conversionRate: '',
          supported: 1
        });
        loadForexRates();
      }
    } catch (error) {
      console.error('Error updating forex rate:', error);
    }
  };

  const handleDeleteForexRate = async (id) => {
    if (window.confirm('Are you sure you want to delete this forex rate?')) {
      try {
        await api.delete(`/api/forex/delete/${id}`);
        loadForexRates();
      } catch (error) {
        console.error('Error deleting forex rate:', error);
      }
    }
  };

  const openEditForm = (rate) => {
    setEditingRate(rate);
    setFormData({
      currencyCode: rate.currencyCode,
      conversionRate: rate.conversionRate,
      supported: rate.supported
    });
  };

  const getCurrencyIcon = (currencyCode) => {
    return <CurrencyDollarIcon className="h-5 w-5 text-[#015F6B]" />;
  };

  const getSupportedStatus = (supported) => {
    return supported === 1 ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Foreign Exchange Rates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage currency exchange rates and conversions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#015F6B] hover:bg-[#00B7AA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015F6B]"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Currency
        </button>
      </div>

      {/* Forex Rates Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {forexRates.map((rate) => (
          <div key={rate.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getCurrencyIcon(rate.currencyCode)}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {rate.currencyName}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {rate.currencyCode}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Rate:</span>
                  <span className="font-medium text-gray-900">
                    {rate.conversionRate.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="flex items-center">
                    {getSupportedStatus(rate.supported)}
                    <span className="ml-1 text-xs text-gray-500">
                      {rate.supported === 1 ? 'Supported' : 'Not Supported'}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-500">Updated:</span>
                  <span className="text-xs text-gray-500">
                    {rate.lastUpdated?.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => openEditForm(rate)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteForexRate(rate.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
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
                Add New Currency
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency Code</label>
                  <input
                    type="text"
                    value={formData.currencyCode}
                    onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="USD"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Conversion Rate</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData({ ...formData, conversionRate: parseFloat(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1.0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supported</label>
                  <select
                    value={formData.supported}
                    onChange={(e) => setFormData({ ...formData, supported: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Supported</option>
                    <option value={0}>Not Supported</option>
                  </select>
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
                  onClick={handleCreateForexRate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Currency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingRate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Currency: {editingRate.currencyCode}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency Code</label>
                  <input
                    type="text"
                    value={formData.currencyCode}
                    onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="USD"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Conversion Rate</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData({ ...formData, conversionRate: parseFloat(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1.0000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supported</label>
                  <select
                    value={formData.supported}
                    onChange={(e) => setFormData({ ...formData, supported: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Supported</option>
                    <option value={0}>Not Supported</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingRate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015F6B]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateForexRate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#015F6B] hover:bg-[#00B7AA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015F6B]"
                >
                  Update Currency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Rate Calculator */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Exchange Rate Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Currency</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {forexRates.map((rate) => (
                <option key={rate.currencyCode} value={rate.currencyCode}>
                  {rate.currencyCode} - {rate.currencyName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="100.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Currency</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {forexRates.map((rate) => (
                <option key={rate.currencyCode} value={rate.currencyCode}>
                  {rate.currencyCode} - {rate.currencyName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-[#015F6B] text-white rounded-md hover:bg-[#00B7AA]">
            Calculate Exchange Rate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forex;
