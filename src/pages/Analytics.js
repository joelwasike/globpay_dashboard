import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const Analytics = () => {
  const { api } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  });
  const [dailyTransactionData, setDailyTransactionData] = useState([]);
  const [paymentMethodDistribution, setPaymentMethodDistribution] = useState([]);
  const [currencyDistribution, setCurrencyDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions
      const response = await api.get('/api/v1/transaction/list');
      let txns = [];
      
      if (response.data?.Transactions) {
        txns = response.data.Transactions;
      } else if (response.data?.transactions) {
        txns = response.data.transactions;
      }

      setTransactions(txns);

      // Calculate basic stats
      const stats = {
        total: txns.length,
        successful: txns.filter(t => t.transaction_status === 'SUCCESS').length,
        pending: txns.filter(t => t.transaction_status === 'PENDING').length,
        failed: txns.filter(t => t.transaction_status === 'FAILED').length,
        totalAmount: txns.reduce((sum, t) => sum + (t.amount || 0), 0)
      };
      setTransactionStats(stats);

      // Generate daily transaction data (last 30 days)
      const dailyData = generateDailyTransactionData(txns);
      setDailyTransactionData(dailyData);

      // Generate payment method distribution
      const paymentMethods = generatePaymentMethodDistribution(txns);
      setPaymentMethodDistribution(paymentMethods);

      // Generate currency distribution
      const currencies = generateCurrencyDistribution(txns);
      setCurrencyDistribution(currencies);

      // Generate recent activity
      const recent = txns.slice(0, 10).map(t => ({
        id: t.id,
        type: t.source_of_funds || 'Payment',
        message: `${t.source_of_funds || 'Payment'} transaction - ${t.amount?.toLocaleString()} ${t.currency}`,
        timestamp: new Date((t.date_added || Date.now()/1000) * 1000),
        severity: t.transaction_status === 'SUCCESS' ? 'success' : 
                 t.transaction_status === 'PENDING' ? 'warning' : 'danger',
        status: t.transaction_status
      }));
      setRecentActivity(recent);

    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Set mock data on error
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateDailyTransactionData = (txns) => {
    const dailyData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayTransactions = txns.filter(t => {
        const txDate = new Date((t.date_added || Date.now()/1000) * 1000);
        return txDate >= dayStart && txDate <= dayEnd;
      });

      const successful = dayTransactions.filter(t => t.transaction_status === 'SUCCESS');
      const failed = dayTransactions.filter(t => t.transaction_status === 'FAILED');
      const pending = dayTransactions.filter(t => t.transaction_status === 'PENDING');

      dailyData.push({
        date: format(date, 'MMM dd'),
        successful: successful.length,
        failed: failed.length,
        pending: pending.length,
        total: dayTransactions.length,
        amount: dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      });
    }
    
    return dailyData;
  };

  const generatePaymentMethodDistribution = (txns) => {
    const methodCounts = {};
    txns.forEach(t => {
      const method = t.source_of_funds || 'Unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return Object.entries(methodCounts).map(([method, count], index) => ({
      name: method,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const generateCurrencyDistribution = (txns) => {
    const currencyCounts = {};
    txns.forEach(t => {
      const currency = t.currency || 'Unknown';
      currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return Object.entries(currencyCounts).map(([currency, count], index) => ({
      name: currency,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const setMockData = () => {
    // Set mock data when API fails
    const mockTxns = [
      { id: 1, amount: 1000, currency: 'KES', transaction_status: 'SUCCESS', source_of_funds: 'M-Pesa', date_added: Date.now()/1000 },
      { id: 2, amount: 2000, currency: 'USD', transaction_status: 'SUCCESS', source_of_funds: 'Card', date_added: Date.now()/1000 }
    ];
    setTransactions(mockTxns);
    setTransactionStats({ total: 2, successful: 2, pending: 0, failed: 0, totalAmount: 3000 });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'M-Pesa':
        return <DevicePhoneMobileIcon className="h-4 w-4 text-blue-500" />;
      case 'Card':
        return <CreditCardIcon className="h-4 w-4 text-green-500" />;
      case 'Bank':
        return <BuildingLibraryIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value, currency = 'KES') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time insights and performance metrics based on transaction data
        </p>
      </div>

              {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-8 w-8 text-[#015F6B]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{transactionStats.total}</p>
                </div>
              </div>
            </div>
          </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Successful</p>
                <p className="text-2xl font-semibold text-gray-900">{transactionStats.successful}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{transactionStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(transactionStats.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Trends Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
          Transaction Trends (Last 30 Days)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTransactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'amount' ? 'Amount (KES)' : name]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="successful" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Successful"
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6}
                name="Pending"
              />
              <Area 
                type="monotone" 
                dataKey="failed" 
                stackId="1" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6}
                name="Failed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Method Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Payment Method Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Currency Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Currency Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currencyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Recent Transaction Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.message}</p>
                <p className="text-xs text-gray-500">
                  {format(event.timestamp, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#015F6B]">
              {transactionStats.total > 0 ? ((transactionStats.successful / transactionStats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {transactionStats.total > 0 ? (transactionStats.total / 30).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-500">Avg Daily Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {transactionStats.total > 0 ? formatCurrency(transactionStats.totalAmount / transactionStats.total) : '0'}
            </div>
            <div className="text-sm text-gray-500">Average Transaction Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 