import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { useBankData } from '../../context/BankDataContext';
import { formatDate } from '../../utils/formatters';

const AdminComplaintsPage = () => {
  const { complaints, adminUpdateComplaint } = useBankData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Edit / Respond Modal State
  const [respondTarget, setRespondTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [responseText, setResponseText] = useState('');
  const [submitError, setSubmitError] = useState('');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesId = String(c.id || '').toLowerCase().includes(q);
        const matchesSub = (c.subject || '').toLowerCase().includes(q);
        const matchesCat = (c.category || '').toLowerCase().includes(q);
        const matchesCust = (c.customerName || '').toLowerCase().includes(q);
        if (!matchesId && !matchesSub && !matchesCat && !matchesCust) return false;
      }
      if (statusFilter !== 'All' && (c.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [complaints, searchTerm, statusFilter]);

  const handleOpenRespond = (complaint) => {
    setRespondTarget(complaint);
    setNewStatus(complaint.status === 'Submitted' ? 'In Progress' : complaint.status);
    setResponseText(complaint.adminResponse || '');
    setSubmitError('');
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      setSubmitError('Please enter an official response or resolution note');
      return;
    }
    if (respondTarget) {
      await adminUpdateComplaint(respondTarget.id, newStatus, responseText.trim());
      setRespondTarget(null);
      if (selectedComplaint && selectedComplaint.id === respondTarget.id) {
        setSelectedComplaint(null);
      }
    }
  };

  const columns = [
    {
      header: 'Ticket ID',
      key: 'id',
      cellClassName: 'font-mono text-xs font-bold text-slate-900',
    },
    {
      header: 'Submitted',
      key: 'submittedDate',
      cellClassName: 'text-xs text-slate-500',
      render: (row) => formatDate(row.submittedDate, true),
    },
    {
      header: 'Customer',
      key: 'customerName',
      cellClassName: 'font-semibold text-xs text-slate-800',
    },
    {
      header: 'Category & Subject',
      key: 'subject',
      render: (row) => (
        <div>
          <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded mr-1.5">
            {row.category}
          </span>
          <span className="font-medium text-slate-900 text-xs">{row.subject}</span>
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
    {
      header: 'Action',
      key: 'actions',
      className: 'text-center w-28',
      cellClassName: 'text-center',
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedComplaint(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
            title="Inspect"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenRespond(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="Update Status / Respond"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Complaints & Grievance Desk</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review logged tickets, escalate investigation, and post official resolution updates
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Filter:</span>
          {['All', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
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

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredComplaints.length}</span> tickets
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredComplaints}
        searchPlaceholder="Search complaints by ID, subject, customer, category..."
        pageSize={8}
        onRowClick={(row) => setSelectedComplaint(row)}
      />

      {/* Complaint View Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title="Grievance Ticket Details"
          subtitle={`Ticket ID: ${selectedComplaint.id}`}
          size="md"
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3.5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedComplaint.category}
                </span>
                <p className="font-bold text-slate-900 text-sm mt-1">{selectedComplaint.subject}</p>
              </div>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Customer Name</span>
                <span className="font-semibold text-slate-800">{selectedComplaint.customerName}</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Logged Timestamp</span>
                <span className="font-semibold text-slate-800">
                  {formatDate(selectedComplaint.submittedDate, true)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-slate-100">
              <span className="text-slate-400 block text-[10px] mb-1">Customer Grievance Narrative</span>
              <p className="text-slate-700 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            {selectedComplaint.adminResponse && (
              <div className="p-3 bg-blue-50 rounded border border-blue-100 text-slate-800">
                <span className="text-blue-900 font-semibold block text-[10px] uppercase mb-1">
                  Bank Official Resolution
                </span>
                <p>{selectedComplaint.adminResponse}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                handleOpenRespond(selectedComplaint);
                setSelectedComplaint(null);
              }}
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Update Status / Add Resolution
            </button>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Respond Modal */}
      {respondTarget && (
        <Modal
          isOpen={!!respondTarget}
          onClose={() => setRespondTarget(null)}
          title="Resolve Grievance Ticket"
          subtitle={`Ticket #${respondTarget.id} - ${respondTarget.customerName}`}
          size="md"
        >
          <form onSubmit={handleSaveResponse} className="space-y-4">
            {submitError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Update Ticket Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Submitted">Submitted (Under Initial Review)</option>
                <option value="In Progress">In Progress (Investigating with Gateway)</option>
                <option value="Resolved">Resolved (Settlement / Reversal Completed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Resolution Response to Customer <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter investigation outcome, refund confirmation, or clarification..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRespondTarget(null)}
                className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save & Notify Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
