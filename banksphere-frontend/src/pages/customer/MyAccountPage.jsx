import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Wifi,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency } from '../../utils/formatters';

const MyAccountPage = () => {
  const { user } = useAuth();
  const { accounts, primaryAccount } = useBankData();

  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const debitCard = primaryAccount?.debitCard || {
    cardNumber: '4532 8921 7734 5120',
    cvv: '824',
    expiry: '08/29',
    cardHolder: (user?.fullName || user?.name || 'ACCOUNT HOLDER').toUpperCase(),
    cardType: 'Visa Platinum International',
    status: 'Active',
    dailyLimit: 50000,
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Bank Accounts</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed overview of your registered savings, fixed deposits, and linked debit cards
        </p>
      </div>

      {/* Main Grid: Account Info + Debit Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Account Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {primaryAccount?.accountType || 'Savings Account'}
                </h2>
                <p className="text-xs text-slate-400">Primary Operating Account</p>
              </div>
            </div>
            <StatusBadge status={primaryAccount?.status || 'Active'} />
          </div>

          {/* Account Balance Highlight */}
          <div className="my-5 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 font-medium">Available Clear Balance</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-0.5">
                {formatCurrency(primaryAccount?.balance)}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" /> Interest Rate: 3.50% p.a. calculated daily
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Currency</span>
              <p className="text-sm font-bold">INR (₹ Indian Rupee)</p>
            </div>
          </div>

          {/* Detailed Account Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">Account Number</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {primaryAccount?.accountNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(primaryAccount?.accountNumber, 'acc')}
                  className="text-slate-400 hover:text-blue-600"
                  title="Copy"
                >
                  {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">IFSC Code</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {primaryAccount?.ifscCode}
                </span>
                <button
                  onClick={() => copyToClipboard(primaryAccount?.ifscCode, 'ifsc')}
                  className="text-slate-400 hover:text-blue-600"
                  title="Copy"
                >
                  {copiedIfsc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">Home Branch</span>
              <span className="font-semibold text-slate-800 text-sm">{primaryAccount?.branch}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">Account Opening Date</span>
              <span className="font-semibold text-slate-800 text-sm">
                {primaryAccount?.openingDate || '12 Apr 2021'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">Registered Nominee</span>
              <span className="font-semibold text-slate-800 text-sm">
                {primaryAccount?.nominee || 'Registered Nominee'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">MICR Code</span>
              <span className="font-mono font-semibold text-slate-800 text-sm">560024019</span>
            </div>
          </div>
        </div>

        {/* Realistic Virtual Debit Card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-700 relative overflow-hidden flex flex-col justify-between h-56">
            {/* Background shimmer lines */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-blue-600/10 blur-xl pointer-events-none" />

            {/* Top row */}
            <div className="flex items-center justify-between relative z-10">
              <span className="font-bold text-sm tracking-wider text-slate-200">BankSphere</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-400 rotate-90" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300">Platinum</span>
              </div>
            </div>

            {/* Chip & Contactless */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-7 rounded bg-amber-400/90 border border-amber-300/80 flex items-center justify-center shadow-xs">
                <div className="w-6 h-4 border border-amber-600/40 rounded-xs" />
              </div>
            </div>

            {/* Card Number */}
            <div className="relative z-10">
              <div className="font-mono text-lg sm:text-xl tracking-widest font-semibold text-slate-100">
                {showCardNumber ? debitCard.cardNumber : '•••• •••• •••• ' + debitCard.cardNumber.slice(-4)}
              </div>
            </div>

            {/* Card Holder & Expiry */}
            <div className="flex items-center justify-between text-xs relative z-10 pt-2 border-t border-slate-800">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Card Holder</span>
                <span className="font-medium tracking-wide uppercase text-slate-200">
                  {user?.name || debitCard.cardHolder}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Expires</span>
                <span className="font-mono font-medium text-slate-200">{debitCard.expiry}</span>
              </div>
            </div>
          </div>

          {/* Card Controls Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Debit Card Security</span>
              <StatusBadge status={debitCard.status} size="xs" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Card Number Display</span>
              <button
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
              >
                {showCardNumber ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showCardNumber ? 'Hide' : 'Reveal'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">CVV Security Code</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">
                  {showCvv ? debitCard.cvv : '•••'}
                </span>
                <button
                  onClick={() => setShowCvv(!showCvv)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showCvv ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-500">Daily POS / Online Limit</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCurrency(debitCard.dailyLimit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Accounts (FD / RD / Other) */}
      {accounts.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Other Linked Deposits & Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts
              .filter((a) => !a.isPrimary)
              .map((acc) => (
                <div key={acc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 text-sm">{acc.accountType}</span>
                    <StatusBadge status={acc.status} size="xs" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {formatCurrency(acc.balance)}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <p>Account No: <span className="font-mono font-medium text-slate-700">{acc.accountNumber}</span></p>
                    {acc.interestRate && <p>Interest Rate: <span className="font-medium text-slate-700">{acc.interestRate}</span></p>}
                    {acc.maturityDate && <p>Maturity Date: <span className="font-medium text-slate-700">{acc.maturityDate}</span></p>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccountPage;
