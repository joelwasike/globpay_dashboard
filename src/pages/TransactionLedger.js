import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const TransactionLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    asset: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Mock transaction data
    const mockTransactions = [
      {
        id: 'TX-001',
        type: 'deposit',
        asset: 'USD',
        amount: 50000000,
        description: 'Central bank reserve deposit',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'completed',
        user: 'Alice Johnson',
        reference: 'REF-2024-001',
        balance: 1250000000
      },
      {
        id: 'TX-002',
        type: 'withdrawal',
        asset: 'BTC',
        amount: 25,
        description: 'Institutional withdrawal request',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'pending',
        user: 'Bob Smith',
        reference: 'REF-2024-002',
        balance: 1225
      },
      {
        id: 'TX-003',
        type: 'deposit',
        asset: 'EUR',
        amount: 25000000,
        description: 'Euro reserve deposit',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: 'completed',
        user: 'Carol Davis',
        reference: 'REF-2024-003',
        balance: 915000000
      },
      {
        id: 'TX-004',
        type: 'document_upload',
        asset: 'SWIFT',
        amount: null,
        description: 'SWIFT message upload',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        status: 'completed',
        user: 'David Wilson',
        reference: 'REF-2024-004',
        balance: null
      },
      {
        id: 'TX-005',
        type: 'deposit',
        asset: 'ETH',
        amount: 500,
        description: 'Ethereum deposit',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        status: 'completed',
        user: 'Eve Brown',
        reference: 'REF-2024-005',
        balance: 9000
      },
      {
        id: 'TX-006',
        type: 'withdrawal',
        asset: 'USD',
        amount: 10000000,
        description: 'Emergency withdrawal',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        status: 'completed',
        user: 'Frank Miller',
        reference: 'REF-2024-006',
        balance: 1240000000
      },
      {
        id: 'TX-007',
        type: 'deposit',
        asset: 'GBP',
        amount: 15000000,
        description: 'Pound sterling deposit',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'completed',
        user: 'Grace Lee',
        reference: 'REF-2024-007',
        balance: 465000000
      },
      {
        id: 'TX-008',
        type: 'withdrawal',
        asset: 'USDC',
        amount: 1000000,
        description: 'Stablecoin withdrawal',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
        status: 'pending',
        user: 'Henry Taylor',
        reference: 'REF-2024-008',
        balance: 4000000
      }
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }
    if (filters.asset !== 'all') {
      filtered = filtered.filter(tx => tx.asset === filters.asset);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(tx => tx.timestamp >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(tx => tx.timestamp <= new Date(filters.dateTo + 'T23:59:59'));
    }
    if (filters.search) {
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.reference.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, filters, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Asset', 'Amount', 'Description', 'Timestamp', 'Status', 'User', 'Reference'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        tx.id,
        tx.type,
        tx.asset,
        tx.amount || '',
        `"${tx.description}"`,
        format(tx.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        tx.status,
        tx.user,
        tx.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-5 w-5 text-success-500" />;
      case 'withdrawal':
        return <ArrowUpIcon className="h-5 w-5 text-danger-500" />;
      case 'document_upload':
        return <DocumentArrowDownIcon className="h-5 w-5 text-vault-500" />;
      default:
        return <DocumentArrowDownIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return <span className={`${baseClasses} bg-success-100 text-success-800`}>Completed</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-warning-100 text-warning-800`}>Pending</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-danger-100 text-danger-800`}>Failed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const formatAmount = (amount, asset) => {
    if (amount === null) return '-';
    if (asset === 'USD' || asset === 'EUR' || asset === 'GBP') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: asset,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    return `${amount.toLocaleString()} ${asset}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time transaction history and audit trail
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <FunnelIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="document_upload">Document Upload</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
            <select
              value={filters.asset}
              onChange={(e) => setFilters(prev => ({ ...prev, asset: e.target.value }))}
              className="input-field"
            >
              <option value="all">All Assets</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="SWIFT">SWIFT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input-field pl-10"
                placeholder="Search transactions..."
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('type')}
                >
                  Type
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('asset')}
                >
                  Asset
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('timestamp')}
                >
                  Timestamp
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('user')}
                >
                  User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                        <div className="text-sm text-gray-500">{transaction.reference}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{transaction.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{transaction.asset}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatAmount(transaction.amount, transaction.asset)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(transaction.timestamp, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(transaction.timestamp, 'HH:mm:ss')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{transaction.user}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            <p className="text-sm text-gray-500">Total Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {filteredTransactions.filter(tx => tx.type === 'deposit').length}
            </p>
            <p className="text-sm text-gray-500">Deposits</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger-600">
              {filteredTransactions.filter(tx => tx.type === 'withdrawal').length}
            </p>
            <p className="text-sm text-gray-500">Withdrawals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-vault-600">
              {filteredTransactions.filter(tx => tx.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLedger; 