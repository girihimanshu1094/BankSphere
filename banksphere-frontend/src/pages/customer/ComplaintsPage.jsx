import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import StatusBadge from '../../components/common/StatusBadge';
import { useBankData } from '../../context/BankDataContext';
import { complaintService } from '../../services/complaintService';
import { formatDate } from '../../utils/formatters';

const ComplaintsPage = () => {
  const { complaints, submitComplaint, loading } = useBankData();
  const categories = complaintService.getCategories();

  // Form State
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Expandable complaint details
  const [expandedId, setExpandedId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      const newTicket = await submitComplaint({ category, subject, description });
      setSuccessMessage(`Grievance ticket #${newTicket.id} registered successfully. Our operations team has been notified.`);
      setCategory('');
      setSubject('');
      setDescription('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setFormError(err.message || 'Submission failed');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Complaints & Grievance Redressal</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Raise issues regarding failed transactions, card services, or net banking and track officer responses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form (1 column on large screens) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
            <MessageSquareWarning className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Raise New Grievance</h2>
          </div>

          {formError && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSelect
              label="Complaint Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
              placeholder="Select relevant issue"
              required
            />

            <FormInput
              label="Subject / Short Summary"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. UPI failed but amount debited"
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention date, transaction reference, amount, or error messages encountered..."
                required
                className="block w-full text-sm rounded-lg border border-slate-300 py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Register Complaint'}</span>
            </button>
          </form>
        </div>

        {/* Existing Complaints List (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Submitted Complaints ({complaints.length})
            </h2>
            <span className="text-xs text-slate-400">Track resolution progress</span>
          </div>

          {complaints.length > 0 ? (
            complaints.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{formatDate(item.submittedDate, true)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.subject}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} size="xs" />
                      <button className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                          Customer Description:
                        </span>
                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {item.description}
                        </p>
                      </div>

                      {item.adminResponse ? (
                        <div>
                          <span className="text-blue-900 font-semibold uppercase tracking-wider text-[10px] block mb-1 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> BankSphere Helpdesk Resolution / Response:
                          </span>
                          <div className="bg-blue-50 text-slate-800 p-3 rounded-lg border border-blue-200 leading-relaxed">
                            {item.adminResponse}
                            {item.resolvedDate && (
                              <p className="text-[10px] text-slate-400 mt-2">
                                Resolved on: {formatDate(item.resolvedDate, true)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 flex items-center gap-2">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>This complaint has been routed to the relevant banking department and is awaiting resolution.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">No complaints registered</h3>
              <p className="text-xs text-slate-400 mt-1">
                You currently have a clean record with no open support tickets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
