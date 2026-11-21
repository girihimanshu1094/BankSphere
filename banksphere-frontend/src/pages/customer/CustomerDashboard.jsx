import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Send,
  PlusCircle,
  MinusCircle,
  FileText,
  Copy,
  Check,
  CreditCard,
  TrendingUp,
  Receipt,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/forms/FormInput';
import { useAuth } from '../../context/AuthContext';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';
import { INITIAL_MONTHLY_CHART_DATA } from '../../data/mockData';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const {
    primaryAccount,
    totalBalance,
    transactions,
    depositMoney,
    withdrawMoney,
    loading,
  } = useBankData();

  const navigate = useNavigate();

  // Modals state
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Forms state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositRemarks, setDepositRemarks] = useState('Cash Deposit');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawRemarks, setWithdrawRemarks] = useState('Self ATM Cash Withdrawal');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Stats calculation
  const recentTransactions = transactions.slice(0, 6);
  const currentMonthCredits = transactions
    .filter((t) => t.type === 'Credit' && t.status === 'Successful')
    .reduce((sum, t) => sum + t.amount, 0);
  const currentMonthDebits = transactions
    .filter((t) => t.type === 'Debit' && t.status === 'Successful')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCopyAcc = () => {
    if (primaryAccount?.accountNumber) {
      navigator.clipboard.writeText(primaryAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    try {
      await depositMoney(primaryAccount.accountNumber, depositAmount, depositRemarks);
      setActionSuccess(`₹${parseFloat(depositAmount).toLocaleString('en-IN')} deposited successfully!`);
      setDepositAmount('');
      setTimeout(() => {
        setDepositModalOpen(false);
        setActionSuccess('');
      }, 1200);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    try {
      await withdrawMoney(primaryAccount.accountNumber, withdrawAmount, withdrawRemarks);
      setActionSuccess(`₹${parseFloat(withdrawAmount).toLocaleString('en-IN')} withdrawn successfully!`);
      setWithdrawAmount('');
      setTimeout(() => {
        setWithdrawModalOpen(false);
        setActionSuccess('');
      }, 1200);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome, {user?.name || 'Customer'}
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              KYC Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customer ID: <span className="font-mono font-medium text-slate-700">{user?.customerId || 'BSPH-CUST-8492'}</span> | Branch: {primaryAccount?.branch || 'MG Road, Bengaluru'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/customer/transfer')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Transfer Money
          </button>
          <button
            onClick={() => {
              setActionError('');
              setActionSuccess('');
              setDepositModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Deposit
          </button>
          <button
            onClick={() => {
              setActionError('');
              setActionSuccess('');
              setWithdrawModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <MinusCircle className="w-3.5 h-3.5" /> Withdraw
          </button>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Statement
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Available Balance"
          value={formatCurrency(totalBalance)}
          subtitle="Across all savings & deposit accounts"
          icon={Wallet}
          color="blue"
          badge="Live"
        />

        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Primary Account</span>
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
              {primaryAccount?.accountNumber || '10082394512'}
            </span>
            <button
              onClick={handleCopyAcc}
              title="Copy Account Number"
              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {primaryAccount?.accountType || 'Savings Account'} • IFSC: {primaryAccount?.ifscCode || 'BSPH0001042'}
          </p>
        </div>

        <StatCard
          title="Total Inflow (Credits)"
          value={formatCurrency(currentMonthCredits)}
          subtitle="Salary & Deposits"
          icon={ArrowDownLeft}
          color="emerald"
          trend="+12.4%"
          trendLabel="vs last month"
        />

        <StatCard
          title="Total Outflow (Debits)"
          value={formatCurrency(currentMonthDebits)}
          subtitle={`${transactions.length} total transactions`}
          icon={ArrowUpRight}
          color="navy"
          trend="-4.8%"
          trendLabel="spend reduction"
        />
      </div>

      {/* Account Overview Card & Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Account Overview</h3>
              <StatusBadge status={primaryAccount?.status || 'Active'} />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Account Holder</span>
                <span className="font-semibold text-slate-800">{user?.name || 'Rahul Sharma'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Account Type</span>
                <span className="font-semibold text-slate-800">{primaryAccount?.accountType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-semibold text-slate-800">{primaryAccount?.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Available Balance</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {formatCurrency(primaryAccount?.balance)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">IFSC Code</span>
                <span className="font-mono font-semibold text-slate-800">{primaryAccount?.ifscCode}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Branch Name</span>
                <span className="text-slate-800 font-medium text-right">{primaryAccount?.branch}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/customer/my-account')}
              className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-800 py-1.5 flex items-center justify-center gap-1"
            >
              View Full Account Details & Debit Card <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Income vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Cashflow Analytics</h3>
              <p className="text-xs text-slate-400">Income vs Expenditure (Last 6 Months)</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600"></span> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-400"></span> Expenses
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_MONTHLY_CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest activity on your primary savings account</p>
          </div>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All ({transactions.length}) <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Txn ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentTransactions.map((t) => {
                const isCredit = t.type === 'Credit';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-medium text-slate-900">{t.id}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{formatDate(t.date, true)}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{t.description}</div>
                      {t.beneficiaryName && (
                        <div className="text-[11px] text-slate-400">Payee: {t.beneficiaryName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isCredit ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      <span className={isCredit ? 'text-emerald-600' : 'text-slate-900'}>
                        {isCredit ? '+' : '-'} {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={t.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTxn(t)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                        title="View Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Deposit Modal */}
      <Modal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title="Instant Cash Deposit"
        subtitle="Add funds to your primary savings account"
        size="sm"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          {actionError && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
              {actionSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Target Account
            </label>
            <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono font-medium text-slate-800">
              {primaryAccount?.accountNumber} ({primaryAccount?.accountType})
            </div>
          </div>

          <FormInput
            label="Deposit Amount (INR)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="e.g. 10000"
            min="100"
            step="100"
            required
          />

          <FormInput
            label="Remarks"
            value={depositRemarks}
            onChange={(e) => setDepositRemarks(e.target.value)}
            placeholder="e.g. Counter deposit"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDepositModalOpen(false)}
              className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {loading ? 'Depositing...' : 'Confirm Deposit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Instant Withdraw Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Instant Cash Withdrawal"
        subtitle="Withdraw funds from your primary savings account"
        size="sm"
      >
        <form onSubmit={handleWithdrawSubmit} className="space-y-4">
          {actionError && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
              {actionSuccess}
            </div>
          )}

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Source Account</span>
              <span className="text-slate-500">Available: {formatCurrency(primaryAccount?.balance)}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono font-medium text-slate-800">
              {primaryAccount?.accountNumber} ({primaryAccount?.accountType})
            </div>
          </div>

          <FormInput
            label="Withdrawal Amount (INR)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="e.g. 5000"
            min="100"
            max={primaryAccount?.balance}
            step="100"
            required
          />

          <FormInput
            label="Remarks"
            value={withdrawRemarks}
            onChange={(e) => setWithdrawRemarks(e.target.value)}
            placeholder="e.g. ATM withdrawal"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(false)}
              className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              {loading ? 'Withdrawing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Transaction Receipt"
          subtitle="BankSphere Electronic Transaction Advice"
          size="md"
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 print-area">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-600">BankSphere Online Banking</span>
                <p className="text-[10px] text-slate-400">Core Banking Transaction Record</p>
              </div>
              <StatusBadge status={selectedTxn.status} />
            </div>

            <div className="text-center py-3 bg-white rounded-lg border border-slate-100">
              <span className="text-xs text-slate-400">Transaction Amount</span>
              <div
                className={`text-2xl font-bold font-mono ${
                  selectedTxn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {selectedTxn.type === 'Credit' ? '+' : '-'} {formatCurrency(selectedTxn.amount)}
              </div>
              <span className="text-xs font-medium text-slate-500">{selectedTxn.type} Transaction</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Transaction ID</span>
                <span className="font-mono font-semibold text-slate-800">{selectedTxn.id}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Reference Number</span>
                <span className="font-mono font-semibold text-slate-800">{selectedTxn.referenceNo || 'N/A'}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Date & Time</span>
                <span className="font-semibold text-slate-800">{formatDate(selectedTxn.date, true)}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Account Debited/Credited</span>
                <span className="font-mono font-semibold text-slate-800">{maskAccountNumber(selectedTxn.accountNumber)}</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded border border-slate-100 text-xs">
              <span className="text-slate-400 block text-[10px]">Description & Remarks</span>
              <p className="font-medium text-slate-800">{selectedTxn.description}</p>
              {selectedTxn.remarks && <p className="text-slate-500 text-[11px] mt-0.5">Note: {selectedTxn.remarks}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              Print Receipt
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

export default CustomerDashboard;
