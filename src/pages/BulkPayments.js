import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BanknotesIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const BulkPayments = () => {
  const { api, user } = useAuth();
  const [activeTab, setActiveTab] = useState('mobile');
  const [bulkPayments, setBulkPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'mobile',
    payments: [
      {
        amount: '',
        phone: '',
        mobileOperator: 'saf',
        remarks: '',
        status: 'pending'
      }
    ]
  });

  useEffect(() => {
    loadBulkPayments();
  }, [activeTab]);

  const loadBulkPayments = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'mobile' 
        ? '/api/bulk/mobile/list' 
        : '/api/bulk/bank/list';
      
      const response = await api.get(endpoint);
      if (response.data && response.data.bulkPayments) {
        setBulkPayments(response.data.bulkPayments);
      } else {
        // Mock data for demo
        setBulkPayments([
          {
            id: 1,
            type: activeTab,
            amount: 50000,
            phone: '254700000000',
            mobileOperator: 'saf',
            bankName: activeTab === 'bank' ? 'EQUITY' : null,
            accountNumber: activeTab === 'bank' ? '1234567890' : null,
            status: 'SUCCESS',
            remarks: 'Payment for services',
            merchantID: user?.merchantID,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
          },
          {
            id: 2,
            type: activeTab,
            amount: 25000,
            phone: '254711111111',
            mobileOperator: 'mtn',
            bankName: activeTab === 'bank' ? 'KCB' : null,
            accountNumber: activeTab === 'bank' ? '0987654321' : null,
            status: 'PENDING',
            remarks: 'Payment for goods',
            merchantID: user?.merchantID,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading bulk payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBulkPayment = async () => {
    try {
      const endpoint = activeTab === 'mobile' 
        ? '/api/bulk/mobile/create' 
        : '/api/bulk/bank/create';
      
      const payload = formData.payments.map(payment => ({
        ...payment,
        merchantID: user?.merchantID
      }));

      const response = await api.post(endpoint, payload);
      if (response.data) {
        setShowCreateForm(false);
        setFormData({
          type: activeTab,
          payments: [
            {
              amount: '',
              phone: '',
              mobileOperator: 'saf',
              remarks: '',
              status: 'pending'
            }
          ]
        });
        loadBulkPayments();
      }
    } catch (error) {
      console.error('Error creating bulk payment:', error);
    }
  };

  const addPaymentRow = () => {
    setFormData({
      ...formData,
      payments: [
        ...formData.payments,
        {
          amount: '',
          phone: '',
          mobileOperator: 'saf',
          remarks: '',
          status: 'pending'
        }
      ]
    });
  };

  const removePaymentRow = (index) => {
    const newPayments = formData.payments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      payments: newPayments
    });
  };

  const updatePaymentRow = (index, field, value) => {
    const newPayments = [...formData.payments];
    newPayments[index][field] = value;
    setFormData({
      ...formData,
      payments: newPayments
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
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
          <h1 className="text-2xl font-bold text-gray-900">Bulk Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Process multiple payments at once for mobile money or bank transfers
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Bulk Payment
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mobile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DevicePhoneMobileIcon className="h-5 w-5 inline mr-2" />
            Mobile Money
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bank'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BuildingLibraryIcon className="h-5 w-5 inline mr-2" />
            Bank Transfer
          </button>
        </nav>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create Bulk {activeTab === 'mobile' ? 'Mobile Money' : 'Bank'} Payment
              </h3>
              
              <div className="space-y-4">
                {formData.payments.map((payment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Payment {index + 1}</h4>
                      {formData.payments.length > 1 && (
                        <button
                          onClick={() => removePaymentRow(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) => updatePaymentRow(index, 'amount', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter amount"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {activeTab === 'mobile' ? 'Phone Number' : 'Account Number'}
                        </label>
                        <input
                          type="text"
                          value={payment.phone || payment.accountNumber}
                          onChange={(e) => updatePaymentRow(index, activeTab === 'mobile' ? 'phone' : 'accountNumber', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={activeTab === 'mobile' ? '254700000000' : '1234567890'}
                        />
                      </div>
                      
                      {activeTab === 'mobile' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Mobile Operator</label>
                          <select
                            value={payment.mobileOperator}
                            onChange={(e) => updatePaymentRow(index, 'mobileOperator', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="saf">Safaricom</option>
                            <option value="mtn">MTN</option>
                            <option value="airtel">Airtel</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                          <select
                            value={payment.bankName}
                            onChange={(e) => updatePaymentRow(index, 'bankName', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="EQUITY">Equity Bank</option>
                            <option value="KCB">KCB Bank</option>
                            <option value="COOP">Cooperative Bank</option>
                            <option value="ABSA">ABSA Bank</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <input
                          type="text"
                          value={payment.remarks}
                          onChange={(e) => updatePaymentRow(index, 'remarks', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Payment description"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addPaymentRow}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Another Payment
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBulkPayment}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Bulk Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Payments List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Bulk Payment History ({bulkPayments.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'mobile' ? 'Phone/Operator' : 'Bank/Account'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bulkPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {activeTab === 'mobile' ? (
                            <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <BuildingLibraryIcon className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.remarks || `${activeTab} payment`}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {payment.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount?.toLocaleString()} KES
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activeTab === 'mobile' ? (
                          <>
                            {payment.phone}
                            <br />
                            <span className="text-xs text-gray-500">{payment.mobileOperator?.toUpperCase()}</span>
                          </>
                        ) : (
                          <>
                            {payment.bankName}
                            <br />
                            <span className="text-xs text-gray-500">{payment.accountNumber}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.createdAt?.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bulkPayments.length === 0 && (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bulk payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first bulk payment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkPayments;
