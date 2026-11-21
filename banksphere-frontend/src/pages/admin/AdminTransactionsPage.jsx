import React, { useState, useMemo } from 'react';
import { History, Search, Filter, Receipt, Download, RefreshCw } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useBankData } from '../../context/BankDataContext';
import { transactionService } from '../../services/transactionService';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';

const AdminTransactionsPage = () => {
  const { transactions } = useBankData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesId = t.id?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesRef = t.referenceNo?.toLowerCase().includes(q);
        const matchesPayee = t.beneficiaryName?.toLowerCase().includes(q);
        if (!matchesId && !matchesDesc && !matchesRef && !matchesPayee) return false;
      }
      if (typeFilter !== 'All' && t.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      if (statusFilter !== 'All' && t.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const columns = [
    {
      header: 'Txn ID',
      key: 'id',
      cellClassName: 'font-mono text-xs font-bold text-slate-900',
    },
    {
      header: 'Timestamp',
      key: 'date',
      cellClassName: 'text-xs text-slate-500',
      render: (row) => formatDate(row.date, true),
    },
    {
      header: 'Account Debited',
      key: 'accountNumber',
      cellClassName: 'font-mono text-xs text-slate-700',
    },
    {
      header: 'Description / Purpose',
      key: 'description',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.description}</div>
          <div className="text-[11px] text-slate-400">Ref: {row.referenceNo || 'Direct Clearing'}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      className: 'text-center',
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
      className: 'text-right',
      cellClassName: 'text-right font-mono font-bold text-xs',
      render: (row) => (
        <span className={row.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}>
          {row.type === 'Credit' ? '+' : '-'} {formatCurrency(row.amount)}
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
      header: 'Audit Slip',
      key: 'actions',
      className: 'text-center',
      cellClassName: 'text-center',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTxn(row);
          }}
          className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
          title="View Voucher"
        >
          <Receipt className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transaction Monitoring & Audit</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit log of transfers, deposits, and clearing settlements
          </p>
        </div>

        <button
          onClick={() => transactionService.downloadStatementCSV(filteredTxns, 'BankSphere_Admin_Audit_Report.csv')}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-500">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800"
          >
            <option value="All">All Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <span className="text-xs font-bold uppercase text-slate-500 ml-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredTxns.length}</span> recorded clearing transactions
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTxns}
        searchPlaceholder="Search audit log by Txn ID, Description, or UTR..."
        pageSize={10}
        onRowClick={(row) => setSelectedTxn(row)}
      />

      {/* Audit Voucher Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Bank Audit Clearing Voucher"
          subtitle={`UTR: ${selectedTxn.referenceNo || selectedTxn.id}`}
          size="md"
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">Transaction Classification</span>
              <StatusBadge status={selectedTxn.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Txn ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedTxn.id}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Amount</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(selectedTxn.amount)}
                </span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Originating A/c</span>
                <span className="font-mono font-semibold text-slate-800">{selectedTxn.accountNumber}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Timestamp</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedTxn.date, true)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Narrative</span>
              <p className="font-semibold text-slate-900">{selectedTxn.description}</p>
              {selectedTxn.remarks && <p className="text-slate-500 mt-1">Remarks: {selectedTxn.remarks}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedTxn(null)}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
