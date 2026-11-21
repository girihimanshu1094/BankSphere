import React from 'react';

const STATUS_STYLES = {
  // Success / Active
  successful: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  credit: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  // Pending / In-progress
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'in progress': 'bg-blue-50 text-blue-700 border-blue-200',
  submitted: 'bg-slate-100 text-slate-700 border-slate-200',
  'pending re-kyc': 'bg-amber-50 text-amber-700 border-amber-200',

  // Warning / Danger / Inactive
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  blocked: 'bg-rose-50 text-rose-700 border-rose-200',
  debit: 'bg-slate-100 text-slate-700 border-slate-200',
  dormant: 'bg-slate-100 text-slate-700 border-slate-200',
};

const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  if (!status) return null;
  const key = String(status).toLowerCase();
  const colorClass = STATUS_STYLES[key] || 'bg-slate-100 text-slate-700 border-slate-200';

  const sizeClass = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClass} ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
