import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Search,
  CheckCheck,
} from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminLoansPage = () => {
  const {
    adminLoans,
    adminLoansLoading,
    adminLoansError,
    fetchAdminLoans,
    adminApproveLoan,
    adminRejectLoan,
  } = useBankData();

  // Load loans on mount (admin only)
  useEffect(() => {
    fetchAdminLoans();
  }, [fetchAdminLoans]);

  // Modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const handleConfirmApprove = async () => {
    if (approveTarget) {
      const idToApprove = approveTarget.loanId ?? approveTarget.id;
      await adminApproveLoan(idToApprove, 'Approved based on credit appraisal and CIBIL score.');
      setApproveTarget(null);
      if (selectedLoan && (selectedLoan.loanId ?? selectedLoan.id) === idToApprove) setSelectedLoan(null);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectError('Please specify the official reason for loan rejection');
      return;
    }
    if (rejectTarget) {
      const idToReject = rejectTarget.loanId ?? rejectTarget.id;
      await adminRejectLoan(idToReject, rejectionReason);
      setRejectTarget(null);
      setRejectionReason('');
      setRejectError('');
      if (selectedLoan && (selectedLoan.loanId ?? selectedLoan.id) === idToReject) setSelectedLoan(null);
    }
  };

  const columns = [
    { header: 'App ID', key: 'loanId', cellClassName: 'font-mono text-xs font-bold text-slate-900', render: (row) => row.loanId ?? row.id },
    { header: 'Applied Date', key: 'applicationDate', cellClassName: 'text-xs text-slate-500', render: (row) => formatDate(row.applicationDate) },
    { header: 'Applicant', key: 'fullName', render: (row) => `${row.fullName} (${row.email})` },
    { header: 'Loan Product', key: 'purpose', render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.purpose}</div>
          <div className="text-[11px] text-slate-400">Amount: {formatCurrency(row.loanAmount)}</div>
        </div>
      )
    },
    { header: 'Interest Rate', key: 'interestRate', render: (row) => `${row.interestRate}% p.a.` },
    { header: 'Tenure', key: 'tenureMonths', render: (row) => `${row.tenureMonths} months` },
    { header: 'Status', key: 'status', className: 'text-center', cellClassName: 'text-center', render: (row) => <StatusBadge status={row.status} size="xs" /> },
    { header: 'Decisions', key: 'actions', className: 'text-center w-36', cellClassName: 'text-center', render: (row) => {
        const isPending = (row.status || '').toUpperCase() === 'PENDING';
        return (
          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedLoan(row)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100" title="Inspect Application"><Eye className="w-4 h-4" /></button>
            {isPending && (
              <>
                <button onClick={() => setApproveTarget(row)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Approve Loan"><CheckCircle className="w-4 h-4" /></button>
                <button onClick={() => { setRejectTarget(row); setRejectionReason('Insufficient debt-to-income ratio or documentation discrepancies.'); }} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded" title="Reject Loan"><XCircle className="w-4 h-4" /></button>
              </>
            )}
          </div>
        );
      } },
  ];

  if (adminLoansLoading) return <div className="p-4 text-center">Loading loan applications…</div>;
  if (adminLoansError) return <div className="p-4 text-center text-rose-600">Failed to load loans. <button className="underline" onClick={fetchAdminLoans}>Retry</button></div>;
  if (!adminLoans || adminLoans.length === 0) return <div className="p-4 text-center text-slate-500">No loan applications found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Credit & Loan Appraisal Desk</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Evaluate customer loan applications, perform credit checks, and approve or reject disbursals</p>
        </div>
      </div>
      <DataTable columns={columns} data={adminLoans} searchPlaceholder="Search application by ID, applicant or purpose…" pageSize={8} onRowClick={(row) => setSelectedLoan(row)} />

      {/* Loan Details Modal */}
      {selectedLoan && (
        <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title="Loan Application Appraisal File" subtitle={`Application Ref: ${selectedLoan.loanId ?? selectedLoan.id}`} size="md">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedLoan.purpose}</h3>
                <p className="text-slate-400 text-[11px]">Submission Date: {formatDate(selectedLoan.applicationDate)}</p>
                <p className="text-slate-600 text-[11px]">Applicant: {selectedLoan.fullName} ({selectedLoan.email})</p>
              </div>
              <StatusBadge status={selectedLoan.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Requested Loan Amount</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{formatCurrency(selectedLoan.loanAmount)}</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Interest Rate</span>
                <span className="font-semibold text-slate-800">{selectedLoan.interestRate}% p.a.</span>
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Tenure</span>
                <span className="font-semibold text-slate-800">{selectedLoan.tenureMonths} Months</span>
              </div>
            </div>
            {selectedLoan.adminRemarks && (
              <div className="p-2.5 bg-blue-50/60 rounded border border-blue-100 text-blue-900">
                <span className="text-[10px] font-semibold uppercase block mb-0.5">Appraisal Remarks</span>
                <p>{selectedLoan.adminRemarks}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {(selectedLoan.status || '').toUpperCase() === 'PENDING' && (
                <>
                  <button onClick={() => { setApproveTarget(selectedLoan); setSelectedLoan(null); }} className="flex-1 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Approve Application</button>
                  <button onClick={() => { setRejectTarget(selectedLoan); setSelectedLoan(null); }} className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors">Reject with Reason</button>
                </>
              )}
              <button onClick={() => setSelectedLoan(null)} className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Approve Dialog */}
      <ConfirmDialog isOpen={!!approveTarget} onClose={() => setApproveTarget(null)} onConfirm={handleConfirmApprove} title="Sanction Loan Application" message={`Are you sure you want to approve ${approveTarget?.purpose} of ${formatCurrency(approveTarget?.loanAmount)} for reference ${approveTarget?.loanId ?? approveTarget?.id}?`} confirmText="Confirm Approval" variant="info" />

      {/* Reject Modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Loan Application" subtitle={`Application: ${rejectTarget?.loanId ?? rejectTarget?.id}`} size="sm">
        <form onSubmit={handleConfirmReject} className="space-y-4">
          {rejectError && <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">{rejectError}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Rejection Reason / Observations <span className="text-rose-500">*</span></label>
            <textarea rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="e.g. CIBIL score below minimum credit benchmark..." className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500" required />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setRejectTarget(null)} className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg">Confirm Rejection</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLoansPage;