import React, { useState, useMemo } from 'react';
import {
  Download,
  Filter,
  Search,
  Receipt,
  FileSpreadsheet,
  ArrowUpDown,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useBankData } from '../../context/BankDataContext';
import { transactionService } from '../../services/transactionService';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';

const TransactionsPage = () => {
  const { transactions, refreshData } = useBankData();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesId = t.id?.toLowerCase().includes(q);
        const matchesPayee = t.beneficiaryName?.toLowerCase().includes(q);
        const matchesRef = t.referenceNo?.toLowerCase().includes(q);
        if (!matchesDesc && !matchesId && !matchesPayee && !matchesRef) return false;
      }

      // Type filter
      if (typeFilter !== 'All' && t.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All' && t.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Date filters
      if (startDate) {
        const start = new Date(startDate).getTime();
        if (new Date(t.date).getTime() < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(t.date).getTime() > end.getTime()) return false;
      }

      return true;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter, startDate, endDate]);

  const handleDownloadStatement = () => {
    transactionService.downloadStatementCSV(filteredTransactions);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
  };

  const columns = [
    {
      header: 'Txn ID',
      key: 'id',
      className: 'w-32',
      cellClassName: 'font-mono text-xs font-semibold text-slate-900',
    },
    {
      header: 'Date & Time',
      key: 'date',
      className: 'w-40',
      cellClassName: 'text-xs text-slate-500',
      render: (row) => formatDate(row.date, true),
    },
    {
      header: 'Description / Payee',
      key: 'description',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.description}</div>
          <div className="text-[11px] text-slate-400">
            {row.category && <span className="mr-1.5">{row.category} •</span>}
            {row.referenceNo && <span>Ref: {row.referenceNo}</span>}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      className: 'w-24 text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            row.type === 'Credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      header: 'Amount',
      key: 'amount',
      className: 'w-32 text-right',
      cellClassName: 'text-right font-mono font-bold text-sm',
      render: (row) => (
        <span className={row.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}>
          {row.type === 'Credit' ? '+' : '-'} {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      className: 'w-28 text-center',
      cellClassName: 'text-center',
      render: (row) => <StatusBadge status={row.status} size="xs" />,
    },
    {
      header: 'Action',
      key: 'actions',
      className: 'w-20 text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTxn(row);
          }}
          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
          title="View Receipt"
        >
          <Receipt className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transaction History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, inspect transaction details, and download statements
          </p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download Statement (CSV)</span>
        </button>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter Transactions
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Transaction Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Credit">Credit (Inflow)</option>
              <option value="Debit">Debit (Outflow)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Transaction Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Date Range - From */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Date Range - To */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable
        columns={columns}
        data={filteredTransactions}
        searchPlaceholder="Search by ID, Payee, Description, Reference..."
        pageSize={10}
        emptyMessage="No transactions match your current search and filter filters."
        onRowClick={(row) => setSelectedTxn(row)}
      />

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Electronic Transaction Advice"
          subtitle={`Reference: ${selectedTxn.referenceNo || selectedTxn.id}`}
          size="md"
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5 print-area">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-sm font-bold text-blue-700">BankSphere Online Banking</span>
                <p className="text-[10px] text-slate-400">Core Banking System Audit Voucher</p>
              </div>
              <StatusBadge status={selectedTxn.status} />
            </div>

            <div className="text-center py-3 bg-white rounded-lg border border-slate-100">
              <span className="text-xs text-slate-400">Transaction Value</span>
              <div
                className={`text-2xl font-bold font-mono ${
                  selectedTxn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {selectedTxn.type === 'Credit' ? '+' : '-'} {formatCurrency(selectedTxn.amount)}
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {selectedTxn.type} Operation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Transaction ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedTxn.id}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Reference / UTR</span>
                <span className="font-mono font-bold text-slate-900">{selectedTxn.referenceNo || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Transaction Timestamp</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedTxn.date, true)}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Bank Account</span>
                <span className="font-mono font-semibold text-slate-800">
                  {maskAccountNumber(selectedTxn.accountNumber)}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded border border-slate-100 text-xs">
              <span className="text-slate-400 block text-[10px]">Description</span>
              <p className="font-semibold text-slate-900">{selectedTxn.description}</p>
              {selectedTxn.beneficiaryName && (
                <p className="text-slate-500 mt-1">Beneficiary Payee: {selectedTxn.beneficiaryName}</p>
              )}
              {selectedTxn.remarks && (
                <p className="text-slate-500 mt-0.5">Remarks: {selectedTxn.remarks}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print Advice Slip
            </button>
            <button
              onClick={() => setSelectedTxn(null)}
              className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;
