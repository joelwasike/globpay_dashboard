import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  LinkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [payoutBalance, setPayoutBalance] = useState({ totalBalance: 0, baseCurrency: 'USD' });
  const [payinBalance, setPayinBalance] = useState({ totalBalance: 0, baseCurrency: 'USD' });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load payout balance
      try {
        const balanceResponse = await api.get('/api/v1/transaction/read/balance');
        if (balanceResponse.data && balanceResponse.data.Balances) {
          const b = balanceResponse.data.Balances;
          setPayoutBalance({ totalBalance: b.totalBalance || 0, baseCurrency: 'USD' });
        }
      } catch (error) {
        console.error('Error loading payout balance:', error);
      }

      // Load payin balance
      try {
        const payinResp = await api.get('/api/v1/transaction/read/payins/balance');
        if (payinResp.data && payinResp.data.Balances) {
          const b = payinResp.data.Balances;
          setPayinBalance({ totalBalance: b.totalBalance || 0, baseCurrency: 'USD' });
        }
      } catch (error) {
        console.error('Error loading payin balance:', error);
      }

      // Load transactions list for stats and recent
      try {
        const transactionsResponse = await api.get('/api/v1/transaction/list');
        let txns = [];
        if (transactionsResponse.data?.Transactions) {
          txns = transactionsResponse.data.Transactions;
        } else if (transactionsResponse.data?.transactions) {
          txns = transactionsResponse.data.transactions;
        }
        if (Array.isArray(txns)) {
          setRecentTransactions(txns.slice(0, 5));
          const stats = {
            total: txns.length,
            successful: txns.filter(t => t.transaction_status === 'SUCCESS').length,
            pending: txns.filter(t => t.transaction_status === 'PENDING').length,
          };
          setTransactionStats(stats);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}. Here's what's happening with your merchant account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Payout Balance */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-[#015F6B]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Payout Balance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payoutBalance.totalBalance.toLocaleString()} {payoutBalance.baseCurrency}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Payin Balance */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-[#00B7AA]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Payin Balance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payinBalance.totalBalance.toLocaleString()} {payinBalance.baseCurrency}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-6 w-6 text-[#015F6B]" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                  <dd className="text-lg font-medium text-gray-900">{transactionStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Successful Transactions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-gray-900">{transactionStats.successful}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{transactionStats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentTransactions.map((transaction, transactionIdx) => (
                <li key={transaction.id}>
                  <div className="relative pb-8">
                    {transactionIdx !== recentTransactions.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-[#015F6B] flex items-center justify-center ring-8 ring-white">
                          {getStatusIcon(transaction.transaction_status)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {transaction.external_id || `${transaction.source_of_funds} transaction`}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {transaction.amount?.toLocaleString()} {transaction.currency}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.transaction_status)}`}>
                              {transaction.transaction_status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {format(new Date((transaction.date_added || Date.now()/1000) * 1000), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => navigate('/bulk-payments')}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#015F6B] rounded-lg border border-gray-200 hover:border-[#00B7AA]"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-[#015F6B] text-white ring-4 ring-white">
                  <BanknotesIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  Create Bulk Payment
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Process multiple payments at once
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/payment-links')}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#015F6B] rounded-lg border border-gray-200 hover:border-[#00B7AA]"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-[#00B7AA] text-white ring-4 ring-white">
                  <LinkIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  Generate Payment Link
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create shareable payment links
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/forex')}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#015F6B] rounded-lg border border-gray-200 hover:border-[#00B7AA]"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-[#015F6B] text-white ring-4 ring-white">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  Forex Rates
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage exchange rates
                </p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/wallet-transfers')}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#015F6B] rounded-lg border border-gray-200 hover:border-[#00B7AA]"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-[#00B7AA] text-white ring-4 ring-white">
                  <ArrowPathIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  Wallet Transfer
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Transfer funds between wallets
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 