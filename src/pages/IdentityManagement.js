import React, { useState, useEffect } from 'react';
import {
  UserPlusIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const IdentityManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Officer',
    status: 'active',
    permissions: []
  });

  const roles = [
    { id: 'Admin', name: 'Administrator', permissions: ['read', 'write', 'admin', 'audit'] },
    { id: 'Officer', name: 'Vault Officer', permissions: ['read', 'write'] },
    { id: 'Audit', name: 'Auditor', permissions: ['read', 'audit'] },
    { id: 'Viewer', name: 'Viewer', permissions: ['read'] }
  ];

  const permissions = [
    { id: 'read', name: 'Read Access', description: 'View vault data and transactions' },
    { id: 'write', name: 'Write Access', description: 'Perform vault operations' },
    { id: 'admin', name: 'Administrative', description: 'Manage users and settings' },
    { id: 'audit', name: 'Audit Access', description: 'Access audit logs and compliance data' }
  ];

  useEffect(() => {
    // Mock user data
    const mockUsers = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@centralbank.com',
        role: 'Admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
        permissions: ['read', 'write', 'admin', 'audit'],
        activityCount: 45,
        riskLevel: 'low'
      },
      {
        id: 2,
        name: 'Alice Johnson',
        email: 'alice.johnson@centralbank.com',
        role: 'Officer',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4),
        permissions: ['read', 'write'],
        activityCount: 23,
        riskLevel: 'low'
      },
      {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob.wilson@centralbank.com',
        role: 'Audit',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8),
        permissions: ['read', 'audit'],
        activityCount: 12,
        riskLevel: 'medium'
      },
      {
        id: 4,
        name: 'Carol Davis',
        email: 'carol.davis@centralbank.com',
        role: 'Officer',
        status: 'inactive',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        permissions: ['read', 'write'],
        activityCount: 0,
        riskLevel: 'high'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@centralbank.com',
        role: 'Viewer',
        status: 'active',
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12),
        permissions: ['read'],
        activityCount: 8,
        riskLevel: 'low'
      }
    ];

    setUsers(mockUsers);
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    const user = {
      id: Date.now(),
      ...newUser,
      lastLogin: new Date(),
      activityCount: 0,
      riskLevel: 'low'
    };
    setUsers(prev => [...prev, user]);
    setShowAddUser(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Officer',
      status: 'active',
      permissions: []
    });
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { ...user, ...selectedUser } : user
    ));
    setShowEditUser(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-danger-100 text-danger-800';
      case 'Officer':
        return 'bg-vault-100 text-vault-800';
      case 'Audit':
        return 'bg-warning-100 text-warning-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-success-100 text-success-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-success-100 text-success-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'high':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityHeatmap = (user) => {
    // Mock activity data for the last 7 days
    const days = 7;
    const heatmap = [];
    for (let i = 0; i < days; i++) {
      const activity = Math.floor(Math.random() * 10);
      heatmap.push({
        day: i,
        activity,
        intensity: activity > 7 ? 'high' : activity > 3 ? 'medium' : 'low'
      });
    }
    return heatmap;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Identity & Access Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles, permissions, and access controls
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserPlusIcon className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-vault-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLogin.toLocaleDateString()} {user.lastLogin.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getActivityHeatmap(user).map((day, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-sm ${
                            day.intensity === 'high' ? 'bg-vault-600' :
                            day.intensity === 'medium' ? 'bg-vault-300' :
                            'bg-gray-200'
                          }`}
                          title={`Day ${day.day + 1}: ${day.activity} activities`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(user.riskLevel)}`}>
                      {user.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditUser(true);
                        }}
                        className="text-vault-600 hover:text-vault-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`${user.status === 'active' ? 'text-warning-600 hover:text-warning-900' : 'text-success-600 hover:text-success-900'}`}
                      >
                        {user.status === 'active' ? <XMarkIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="input-field"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser(prev => ({ ...prev, role: e.target.value }))}
                    className="input-field"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser(prev => ({ ...prev, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditUser(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Overview */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Role Permissions Overview</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => (
            <div key={role.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role.id)}`}>
                  {role.id}
                </span>
              </div>
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(permission.id)}
                      disabled
                      className="h-4 w-4 text-vault-600 focus:ring-vault-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-xs text-gray-700">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdentityManagement; 