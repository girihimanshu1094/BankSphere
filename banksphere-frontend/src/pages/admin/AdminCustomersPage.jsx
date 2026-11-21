import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Lock,
  Unlock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminCustomersPage = () => {
  const { customers, adminBlockCustomer, adminUnblockCustomer, adminAddCustomer } = useBankData();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [unblockTarget, setUnblockTarget] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add Customer Form
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    accountType: 'Savings',
    initialDeposit: '25000',
    branch: 'MG Road, Bengaluru',
  });
  const [addError, setAddError] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesAcc = c.accountNumber?.includes(q);
        if (!matchesName && !matchesEmail && !matchesAcc) return false;
      }
      if (statusFilter !== 'All' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleConfirmBlock = async () => {
    if (blockTarget) {
      await adminBlockCustomer(blockTarget.id, 'Administrative Audit Hold');
      setBlockTarget(null);
    }
  };

  const handleConfirmUnblock = async () => {
    if (unblockTarget) {
      await adminUnblockCustomer(unblockTarget.id);
      setUnblockTarget(null);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!newCustomerData.name.trim()) {
      setAddError('Customer name is required');
      return;
    }
    if (!newCustomerData.email.trim()) {
      setAddError('Email is required');
      return;
    }
    try {
      await adminAddCustomer(newCustomerData);
      setAddModalOpen(false);
      setNewCustomerData({
        name: '',
        email: '',
        phone: '',
        accountType: 'Savings',
        initialDeposit: '25000',
        branch: 'MG Road, Bengaluru',
      });
    } catch (err) {
      setAddError(err.message || 'Failed to create customer');
    }
  };

  const columns = [
    {
      header: 'Customer',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
            {(row.name || 'User')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Account Number',
      key: 'accountNumber',
      cellClassName: 'font-mono text-xs font-semibold text-slate-800',
    },
    {
      header: 'Type',
      key: 'accountType',
      cellClassName: 'text-xs text-slate-600',
    },
    {
      header: 'Balance',
      key: 'balance',
      className: 'text-right',
      cellClassName: 'text-right font-mono font-bold text-xs text-slate-900',
      render: (row) => formatCurrency(row.balance),
    },
    {
      header: 'KYC Status',
      key: 'kycStatus',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
          {row.kycStatus || 'Verified'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-center w-32',
      cellClassName: 'text-center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedCustomer(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'Active' ? (
            <button
              onClick={() => setBlockTarget(row)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
              title="Block Customer Account"
            >
              <Lock className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setUnblockTarget(row)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
              title="Unblock Customer Account"
            >
              <Unlock className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain customer records, KYC profiles, and account freeze/unblock operations
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Status:</span>
          <div className="flex items-center gap-1.5">
            {['All', 'Active', 'Blocked'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredCustomers.length}</span> active customer files
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        searchPlaceholder="Search customer by name, email, or account number..."
        pageSize={8}
        onRowClick={(row) => setSelectedCustomer(row)}
      />

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Customer Profile & KYC Dossier"
          subtitle={`Account No: ${selectedCustomer.accountNumber}`}
          size="md"
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-white font-bold text-base flex items-center justify-center">
                  {selectedCustomer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <StatusBadge status={selectedCustomer.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Account Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedCustomer.accountNumber}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Account Type</span>
                <span className="font-semibold text-slate-800">{selectedCustomer.accountType}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Clear Balance</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">
                  {formatCurrency(selectedCustomer.balance)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">KYC Verification</span>
                <span className="font-semibold text-blue-700">{selectedCustomer.kycStatus || 'Verified'}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Registered Branch</span>
                <span className="font-semibold text-slate-800">{selectedCustomer.branch || 'Bengaluru HQ'}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Onboarding Date</span>
                <span className="font-semibold text-slate-800">{selectedCustomer.joinDate || '12 Apr 2021'}</span>
              </div>
            </div>

            {selectedCustomer.status === 'Blocked' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  This account has an active Administrative Hold. Outgoing transfers and ATM withdrawals are frozen.
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {selectedCustomer.status === 'Active' ? (
              <button
                onClick={() => {
                  setBlockTarget(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Block Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setUnblockTarget(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Unblock Account
              </button>
            )}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Block Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!blockTarget}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleConfirmBlock}
        title="Block Customer Account"
        message={`Are you sure you want to freeze operations for ${blockTarget?.name} (${blockTarget?.accountNumber})?`}
        confirmText="Confirm Block"
        variant="danger"
      />

      {/* Unblock Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!unblockTarget}
        onClose={() => setUnblockTarget(null)}
        onConfirm={handleConfirmUnblock}
        title="Unblock Customer Account"
        message={`Are you sure you want to lift the administrative freeze for ${unblockTarget?.name}?`}
        confirmText="Confirm Unblock"
        variant="info"
      />

      {/* Add New Customer Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Onboard New Banking Customer"
        subtitle="Onboard a new customer account directly to core banking system"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {addError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {addError}
            </div>
          )}

          <FormInput
            label="Full Customer Legal Name"
            value={newCustomerData.name}
            onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
            placeholder="e.g. Vikram Singhania"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Email Address"
              type="email"
              value={newCustomerData.email}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
              placeholder="e.g. vikram@example.com"
              required
            />
            <FormInput
              label="Phone Number"
              value={newCustomerData.phone}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
              placeholder="10-digit mobile"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormSelect
              label="Account Product Type"
              value={newCustomerData.accountType}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, accountType: e.target.value })}
              options={['Savings Account', 'Current Account', 'Corporate Salary Account']}
            />
            <FormInput
              label="Opening Deposit (INR)"
              type="number"
              value={newCustomerData.initialDeposit}
              onChange={(e) => setNewCustomerData({ ...newCustomerData, initialDeposit: e.target.value })}
              placeholder="e.g. 25000"
            />
          </div>

          <FormSelect
            label="Assigned Home Branch"
            value={newCustomerData.branch}
            onChange={(e) => setNewCustomerData({ ...newCustomerData, branch: e.target.value })}
            options={[
              'MG Road Branch, Bengaluru',
              'Connaught Place, New Delhi',
              'Bandra Kurla Complex, Mumbai',
              'Anna Salai, Chennai',
              'Park Street, Kolkata',
            ]}
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCustomersPage;
