import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Building,
  Edit2,
  Trash2,
  ShieldCheck,
  Send,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import StatusBadge from '../../components/common/StatusBadge';
import { useBankData } from '../../context/BankDataContext';
import { maskAccountNumber } from '../../utils/formatters';

const POPULAR_BANKS = [
  'BankSphere Inter-Bank',
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
];

const BeneficiariesPage = () => {
  const { beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = useBankData();
  const navigate = useNavigate();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState(null);
  const [deletingBen, setDeletingBen] = useState(null);

  // Add / Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    ifscCode: '',
  });

  const [formError, setFormError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Search logic
  const filteredBeneficiaries = useMemo(() => {
    if (!searchTerm.trim()) return beneficiaries;
    const q = searchTerm.toLowerCase();
    return beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.nickname && b.nickname.toLowerCase().includes(q)) ||
        b.accountNumber.includes(q) ||
        b.bankName.toLowerCase().includes(q)
    );
  }, [beneficiaries, searchTerm]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      nickname: '',
      accountNumber: '',
      confirmAccountNumber: '',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
    });
    setFormError('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (ben) => {
    setEditingBen(ben);
    setFormData({
      name: ben.name,
      nickname: ben.nickname || '',
      accountNumber: ben.accountNumber,
      confirmAccountNumber: ben.accountNumber,
      bankName: ben.bankName,
      ifscCode: ben.ifscCode,
    });
    setFormError('');
  };

  const handleSaveBeneficiary = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingBen) {
        await updateBeneficiary(editingBen.id, {
          name: formData.name,
          nickname: formData.nickname,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
        });
        setEditingBen(null);
      } else {
        await addBeneficiary(formData);
        setAddModalOpen(false);
      }
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingBen) {
      await deleteBeneficiary(deletingBen.id);
      setDeletingBen(null);
    }
  };

  const handleCopyAcc = (id, accNo) => {
    navigator.clipboard.writeText(accNo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Beneficiary Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, verify, manage and initiate direct transfers to verified payees
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Beneficiary</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by payee name, nickname, account, bank..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Beneficiaries Grid */}
      {filteredBeneficiaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeneficiaries.map((ben) => (
            <div
              key={ben.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-100">
                      {ben.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{ben.name}</h3>
                      {ben.nickname && (
                        <p className="text-xs text-blue-600 font-medium">"{ben.nickname}"</p>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={ben.status || 'Verified'} size="xs" />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Account Number</span>
                    <div className="flex items-center gap-1.5 font-mono font-medium text-slate-800">
                      <span>{ben.accountNumber}</span>
                      <button
                        onClick={() => handleCopyAcc(ben.id, ben.accountNumber)}
                        title="Copy"
                        className="text-slate-400 hover:text-blue-600"
                      >
                        {copiedId === ben.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name</span>
                    <span className="font-medium text-slate-800">{ben.bankName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code</span>
                    <span className="font-mono font-medium text-slate-800">{ben.ifscCode}</span>
                  </div>

                  {ben.addedOn && (
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Added on</span>
                      <span>{ben.addedOn}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate('/customer/transfer')}
                  className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" /> Quick Pay
                </button>
                <button
                  onClick={() => handleOpenEdit(ben)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Beneficiary"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingBen(ben)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Beneficiary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No beneficiaries found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? 'Try another search term' : 'Add your first beneficiary to start transferring funds.'}
          </p>
        </div>
      )}

      {/* Add / Edit Beneficiary Modal */}
      <Modal
        isOpen={addModalOpen || !!editingBen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingBen(null);
        }}
        title={editingBen ? 'Edit Beneficiary' : 'Add New Beneficiary'}
        subtitle="Ensure beneficiary bank and IFSC details match their official passbook"
        size="md"
      >
        <form onSubmit={handleSaveBeneficiary} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Beneficiary Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Priya Verma"
              required
            />
            <FormInput
              label="Nickname / Label (Optional)"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="e.g. Sister / Landlord"
            />
          </div>

          <FormSelect
            label="Beneficiary Bank"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            options={POPULAR_BANKS}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Account Number"
              value={formData.accountNumber}
              disabled={!!editingBen}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="9 to 18 digits"
              required
            />
            {!editingBen ? (
              <FormInput
                label="Confirm Account Number"
                value={formData.confirmAccountNumber}
                onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                placeholder="Re-type account number"
                required
              />
            ) : (
              <FormInput
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="e.g. HDFC0001245"
                required
              />
            )}
          </div>

          {!editingBen && (
            <FormInput
              label="IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              placeholder="e.g. SBIN0004521"
              required
            />
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setAddModalOpen(false);
                setEditingBen(null);
              }}
              className="flex-1 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingBen ? 'Update Beneficiary' : 'Save Beneficiary'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBen}
        onClose={() => setDeletingBen(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Beneficiary Payee"
        message={`Are you sure you want to remove ${deletingBen?.name} (${deletingBen?.accountNumber}) from your registered beneficiaries?`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};

export default BeneficiariesPage;
