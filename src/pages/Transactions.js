import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Transactions = () => {
  const { api, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let endpoint = '/api/v1/transaction/list';
      
      // Apply filters based on selection
      if (filter === 'mobile') {
        endpoint = '/api/v1/transaction/read/payins';
      } else if (filter === 'bank') {
        endpoint = '/api/v1/transaction/read/bank';
      } else if (filter === 'card') {
        endpoint = '/api/v1/transaction/read/card';
      } else if (filter === 'payouts') {
        endpoint = '/api/v1/transaction/read/mobile/payouts';
      }

      console.log('Loading transactions from endpoint:', endpoint);
      console.log('API configuration:', {
        baseURL: api.defaults.baseURL,
        headers: api.defaults.headers,
        fullURL: `${api.defaults.baseURL}${endpoint}`
      });
      
      const response = await api.get(endpoint);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle the correct response format
      if (response.data && response.data.Transactions) {
        console.log('Found Transactions array with', response.data.Transactions.length, 'transactions');
        setTransactions(response.data.Transactions);
      } else if (response.data && response.data.transactions) {
        console.log('Found transactions array with', response.data.transactions.length, 'transactions');
        setTransactions(response.data.transactions);
      } else {
        console.log('No transactions found in response, using mock data');
        // Mock data for demo
        setTransactions([
          {
            id: 14401,
            amount: 200,
            currency: 'KES',
            transaction_status: 'SUCCESS',
            date_added: 1755762760,
            source_of_funds: 'M-Pesa',
            transaction_report: 'withdraw',
            msisdn: '+254704 763 887',
            external_id: 'App-e6d4a132-c083-488e-aa7a-5923ab614c52',
            checkout_request_id: 'AG_20250821_204024443a229f501022'
          },
          {
            id: 14400,
            amount: 300,
            currency: 'KES',
            transaction_status: 'PENDING',
            date_added: 1755760510,
            source_of_funds: 'M-Pesa',
            transaction_report: 'withdraw',
            msisdn: '+254743331886',
            external_id: 'App-fac47c92-ac24-4f10-8133-f6c470e85e2f',
            checkout_request_id: 'AG_20250821_20502dbf96c528349d5e'
          },
          {
            id: 14399,
            amount: 15000,
            currency: 'USD',
            transaction_status: 'SUCCESS',
            date_added: 1755758260,
            source_of_funds: 'Card',
            transaction_report: 'payment',
            msisdn: '',
            external_id: 'App-card-payment-123',
            checkout_request_id: 'CARD_20250821_123456'
          },
          {
            id: 14398,
            amount: 50000,
            currency: 'KES',
            transaction_status: 'FAILED',
            date_added: 1755756010,
            source_of_funds: 'Bank',
            transaction_report: 'transfer',
            msisdn: '',
            external_id: 'App-bank-transfer-456',
            checkout_request_id: 'BANK_20250821_789012'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Set mock data on error for demo
      setTransactions([
        {
          id: 14401,
          amount: 200,
          currency: 'KES',
          transaction_status: 'SUCCESS',
          date_added: 1755762760,
          source_of_funds: 'M-Pesa',
          transaction_report: 'withdraw',
          msisdn: '+254704 763 887',
          external_id: 'App-e6d4a132-c083-488e-aa7a-5923ab614c52',
          checkout_request_id: 'AG_20250821_204024443a229f501022'
        },
        {
          id: 14400,
          amount: 300,
          currency: 'KES',
          transaction_status: 'PENDING',
          date_added: 1755760510,
          source_of_funds: 'M-Pesa',
          transaction_report: 'withdraw',
          msisdn: '+254743331886',
          external_id: 'App-fac47c92-ac24-4f10-8133-f6c470e85e2f',
          checkout_request_id: 'AG_20250821_20502dbf96c528349d5e'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETE':
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
      case 'COMPLETE':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (sourceOfFunds) => {
    switch (sourceOfFunds) {
      case 'M-Pesa':
        return <DevicePhoneMobileIcon className="h-5 w-5 text-[#015F6B]" />;
      case 'Card':
        return <CreditCardIcon className="h-5 w-5 text-[#00B7AA]" />;
      case 'Bank':
        return <BuildingLibraryIcon className="h-5 w-5 text-[#B5AFB2]" />;
      default:
        return <BanknotesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.transaction_report === 'withdraw') {
      return 'payout';
    } else if (transaction.transaction_report === 'payment') {
      return 'payment';
    } else if (transaction.transaction_report === 'transfer') {
      return 'transfer';
    }
    return 'payment';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.external_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.checkout_request_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.msisdn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.source_of_funds?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = (transaction.transaction_status || '').toUpperCase();
    const matchesStatus =
      statusFilter === 'all' ||
      status === statusFilter ||
      (statusFilter === 'SUCCESS' && status === 'COMPLETE');
    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleDateFilter = async () => {
    if (dateRange.startDate && dateRange.endDate) {
      try {
        setLoading(true);
        const startTimestamp = Math.floor(new Date(dateRange.startDate).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(dateRange.endDate).getTime() / 1000);
        
        const response = await api.get(`/api/v1/transaction/filter?start_date=${startTimestamp}&end_date=${endTimestamp}`);
        if (response.data && response.data.Transactions) {
          setTransactions(response.data.Transactions);
        } else if (response.data && response.data.transactions) {
          setTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error('Error filtering by date:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp * 1000), 'MMM d, yyyy HH:mm');
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your payment transactions
        </p>
      </div>



      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#015F6B] focus:border-[#015F6B] sm:text-sm"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-[#015F6B] bg-opacity-20 text-[#015F6B]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('mobile')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'mobile'
                  ? 'bg-[#015F6B] bg-opacity-20 text-[#015F6B]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => handleFilterChange('bank')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'bank'
                  ? 'bg-[#015F6B] bg-opacity-20 text-[#015F6B]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bank
            </button>
            <button
              onClick={() => handleFilterChange('card')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'card'
                  ? 'bg-[#015F6B] bg-opacity-20 text-[#015F6B]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Card
            </button>
            <button
              onClick={() => handleFilterChange('payouts')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'payouts'
                  ? 'bg-[#015F6B] bg-opacity-20 text-[#015F6B]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payouts
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#015F6B] focus:border-[#015F6B]"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#015F6B] focus:border-[#015F6B]"
            />
            <button
              onClick={handleDateFilter}
              className="px-4 py-2 bg-[#015F6B] text-white text-sm font-medium rounded-md hover:bg-[#00B7AA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015F6B]"
            >
              Filter
            </button>
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#015F6B] focus:border-[#015F6B] bg-white"
            >
              <option value="all">All</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Transaction History ({filteredTransactions.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {getTypeIcon(transaction.source_of_funds)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.checkout_request_id || `TXN${transaction.id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.external_id}
                          </div>
                          {transaction.msisdn && (
                            <div className="text-xs text-gray-400">
                              {transaction.msisdn}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getTransactionType(transaction)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {transaction.source_of_funds}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.amount?.toLocaleString()} {transaction.currency}
                      </div>
                      {transaction.net_amount && transaction.net_amount !== transaction.amount && (
                        <div className="text-xs text-gray-500">
                          Net: {transaction.net_amount?.toLocaleString()} {transaction.currency}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.transaction_status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.transaction_status)}`}>
                          {transaction.transaction_status}
                        </span>
                      </div>
                      {transaction.response_description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.response_description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date_added)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#015F6B] hover:text-[#00B7AA]">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

             {/* Transaction Statistics */}
       <div className="bg-white shadow rounded-lg p-6">
         <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Statistics</h3>
         <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
           <div className="bg-[#015F6B] bg-opacity-10 rounded-lg p-4">
             <div className="flex items-center">
               <BanknotesIcon className="h-8 w-8 text-[#015F6B]" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-[#015F6B]">Total Transactions</p>
                 <p className="text-2xl font-semibold text-[#015F6B]">{transactions.length}</p>
               </div>
             </div>
           </div>
           <div className="bg-green-50 rounded-lg p-4">
             <div className="flex items-center">
               <CheckCircleIcon className="h-8 w-8 text-green-500" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-green-600">Successful</p>
                 <p className="text-2xl font-semibold text-green-900">
                   {transactions.filter(t => (t.transaction_status === 'SUCCESS' || t.transaction_status === 'COMPLETE')).length}
                 </p>
               </div>
             </div>
           </div>
           <div className="bg-yellow-50 rounded-lg p-4">
             <div className="flex items-center">
               <ClockIcon className="h-8 w-8 text-yellow-500" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-yellow-600">Pending</p>
                 <p className="text-2xl font-semibold text-yellow-900">
                   {transactions.filter(t => t.transaction_status === 'PENDING').length}
                 </p>
               </div>
             </div>
           </div>
           <div className="bg-red-50 rounded-lg p-4">
             <div className="flex items-center">
               <XCircleIcon className="h-8 w-8 text-red-500" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-red-600">Failed</p>
                 <p className="text-2xl font-semibold text-red-900">
                   {transactions.filter(t => t.transaction_status === 'FAILED').length}
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
};

export default Transactions;
