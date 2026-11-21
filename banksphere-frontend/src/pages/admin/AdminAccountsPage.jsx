import React, { useState } from 'react';
import { Building2, Search, CreditCard, ShieldCheck } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency } from '../../utils/formatters';

const AdminAccountsPage = () => {
  const { accounts, customers } = useBankData();

  // Master bank accounts ledger from backend accounts / customers
  const allBankAccounts = (accounts && accounts.length > 0)
    ? accounts.map((a) => ({
        id: a.id || `ACC-${a.accountNumber}`,
        accountNumber: a.accountNumber,
        accountType: (a.accountType || '').toUpperCase() === 'SAVINGS' ? 'Savings Account' : (a.accountType || 'Savings Account'),
        balance: Number(a.balance || 0),
        status: (a.status || 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'Active' : a.status,
        branch: a.branch || 'Connaught Place, New Delhi',
        ifscCode: a.ifscCode || 'BSPH0001042',
        holderName: a.holderName || a.name || 'Account Holder',
        email: a.email || '',
      }))
    : customers.map((c) => ({
        id: `ACC-CUST-${c.id}`,
        accountNumber: c.accountNumber,
        accountType: c.accountType,
        balance: Number(c.balance || 0),
        status: c.status,
        branch: c.branch || 'Connaught Place, New Delhi',
        ifscCode: 'BSPH0001042',
        holderName: c.name,
        email: c.email,
      }));

  const columns = [
    {
      header: 'Account Number',
      key: 'accountNumber',
      cellClassName: 'font-mono text-xs font-bold text-slate-900',
    },
    {
      header: 'Account Holder',
      key: 'holderName',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.holderName}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Account Type',
      key: 'accountType',
      cellClassName: 'text-xs text-slate-600',
    },
    {
      header: 'Available Balance',
      key: 'balance',
      className: 'text-right',
      cellClassName: 'text-right font-mono font-bold text-xs text-slate-900',
      render: (row) => formatCurrency(row.balance),
    },
    {
      header: 'Branch & IFSC',
      key: 'branch',
      render: (row) => (
        <div className="text-xs">
          <div className="text-slate-800">{row.branch}</div>
          <div className="font-mono text-[10px] text-slate-400">{row.ifscCode || 'BSPH0001042'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Core Banking Accounts Ledger</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Master audit inventory of all current, savings, and term deposit accounts across bank branches
        </p>
      </div>

      <DataTable
        columns={columns}
        data={allBankAccounts}
        searchPlaceholder="Search account by number, holder name, or branch..."
        pageSize={10}
      />
    </div>
  );
};

export default AdminAccountsPage;
