import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Receipt,
  UserPlus,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import { useBankData } from '../../context/BankDataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { validateAmount } from '../../utils/validators';

const TransferMoneyPage = () => {
  const { accounts, primaryAccount, beneficiaries, transferMoney, loading } = useBankData();
  const navigate = useNavigate();

  // Form State
  const [sourceAccount, setSourceAccount] = useState(
    primaryAccount ? primaryAccount.accountNumber : (accounts[0]?.accountNumber || '')
  );
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [transferMode, setTransferMode] = useState('IMPS');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  // UI Flow State
  const [formErrors, setFormErrors] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [serverError, setServerError] = useState('');

  // Find currently active source account object
  const currentSource = accounts.find((a) => a.accountNumber === sourceAccount) || primaryAccount;

  // Handle beneficiary selection
  const handleBeneficiaryChange = (e) => {
    const val = e.target.value;
    setSelectedBeneficiaryId(val);

    if (val === 'CUSTOM') {
      setBeneficiaryName('');
      setBeneficiaryAccountNumber('');
      setBankName('');
      setIfscCode('');
    } else {
      const ben = beneficiaries.find((b) => b.id === val);
      if (ben) {
        setBeneficiaryName(ben.name);
        setBeneficiaryAccountNumber(ben.accountNumber);
        setBankName(ben.bankName);
        setIfscCode(ben.ifscCode);
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!sourceAccount) errors.sourceAccount = 'Please select a source account';
    if (!beneficiaryName.trim()) errors.beneficiaryName = 'Beneficiary name is required';
    if (!beneficiaryAccountNumber.trim()) {
      errors.beneficiaryAccountNumber = 'Beneficiary account number is required';
    }

    const amtError = validateAmount(amount, currentSource?.balance);
    if (amtError) errors.amount = amtError;

    if (!remarks.trim()) errors.remarks = 'Please enter remarks for this transaction';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiateTransfer = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;
    setConfirmModalOpen(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      const result = await transferMoney({
        sourceAccountNumber: sourceAccount,
        beneficiaryName,
        beneficiaryAccountNumber,
        bankName: bankName || 'BankSphere Partner Bank',
        ifscCode: ifscCode || 'BSPH0001042',
        amount,
        remarks,
        transferType: transferMode,
      });

      setConfirmModalOpen(false);
      setSuccessReceipt(result.transaction);

      // Reset form fields
      setAmount('');
      setRemarks('');
    } catch (err) {
      setServerError(err.message || 'Transfer failed');
      setConfirmModalOpen(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Transfer Money</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perform instant IMPS, NEFT, or RTGS transfers to registered beneficiaries
        </p>
      </div>

      {serverError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleInitiateTransfer} className="space-y-5">
          {/* 1. Source Account */}
          <div className="space-y-1">
            <FormSelect
              label="Select Source Debit Account"
              name="sourceAccount"
              value={sourceAccount}
              onChange={(e) => setSourceAccount(e.target.value)}
              options={accounts.map((acc) => ({
                value: acc.accountNumber,
                label: `${acc.accountType} - ${acc.accountNumber} (Available: ${formatCurrency(acc.balance)})`,
              }))}
              error={formErrors.sourceAccount}
              required
            />
            {currentSource && (
              <div className="text-right text-[11px] text-slate-500 font-mono">
                Available Clear Balance:{' '}
                <span className="font-bold text-slate-900">{formatCurrency(currentSource.balance)}</span>
              </div>
            )}
          </div>

          {/* 2. Beneficiary Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Select Beneficiary <span className="text-rose-500">*</span>
              </label>
              <Link
                to="/customer/beneficiaries"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Manage Payees
              </Link>
            </div>

            <select
              value={selectedBeneficiaryId}
              onChange={handleBeneficiaryChange}
              className="block w-full text-sm rounded-lg border border-slate-300 py-2.5 px-3.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
            >
              <option value="">-- Choose Registered Beneficiary --</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.nickname || b.bankName}) - A/c: {b.accountNumber}
                </option>
              ))}
              <option value="CUSTOM">+ One-time / New Payee Transfer</option>
            </select>
          </div>

          {/* Beneficiary Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <FormInput
              label="Beneficiary Full Name"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="e.g. Priya Verma"
              error={formErrors.beneficiaryName}
              required
            />

            <FormInput
              label="Beneficiary Account Number"
              value={beneficiaryAccountNumber}
              onChange={(e) => setBeneficiaryAccountNumber(e.target.value)}
              placeholder="9 to 18 digits"
              error={formErrors.beneficiaryAccountNumber}
              required
            />

            <FormInput
              label="Beneficiary Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank / State Bank of India"
            />

            <FormInput
              label="IFSC Code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001245"
            />
          </div>

          {/* Transfer Mode & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Transfer Mechanism"
              value={transferMode}
              onChange={(e) => setTransferMode(e.target.value)}
              options={[
                { value: 'IMPS', label: 'IMPS (Immediate 24x7 - Recommended)' },
                { value: 'NEFT', label: 'NEFT (National Electronic Fund Transfer)' },
                { value: 'RTGS', label: 'RTGS (Real Time Gross Settlement - High Value)' },
              ]}
            />

            <FormInput
              label="Transfer Amount (INR)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
              max={currentSource?.balance}
              step="any"
              error={formErrors.amount}
              required
            />
          </div>

          {/* Remarks */}
          <FormInput
            label="Payment Remarks / Purpose"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Monthly rent / Freelance payment"
            error={formErrors.remarks}
            required
          />

          {/* Security Notice */}
          <div className="p-3 bg-blue-50/70 rounded-lg text-xs text-blue-900 flex items-start gap-2 border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Transactions are verified and processed securely through core banking services. Your balance updates immediately upon successful transfer authorization.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Dialog Modal */}
      <ConfirmDialog
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmTransfer}
        title="Confirm Fund Transfer"
        message="Please verify beneficiary and debit account details carefully before confirming."
        confirmText="Confirm & Authorize"
        variant="info"
        loading={loading}
      >
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2 mt-2">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Source Account</span>
            <span className="font-mono font-semibold text-slate-800">{sourceAccount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Beneficiary Payee</span>
            <span className="font-semibold text-slate-900">{beneficiaryName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Payee Account</span>
            <span className="font-mono font-semibold text-slate-800">{beneficiaryAccountNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Transfer Mode</span>
            <span className="font-semibold text-slate-800">{transferMode}</span>
          </div>
          <div className="flex justify-between py-1 text-sm font-bold pt-2">
            <span className="text-slate-700">Total Debit</span>
            <span className="text-blue-700 font-mono">{formatCurrency(parseFloat(amount || 0))}</span>
          </div>
        </div>
      </ConfirmDialog>

      {/* Success Receipt Modal */}
      {successReceipt && (
        <Modal
          isOpen={!!successReceipt}
          onClose={() => setSuccessReceipt(null)}
          title="Transfer Successful"
          subtitle="Your funds have been transferred successfully"
          size="md"
        >
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Transaction Complete</h3>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              {formatCurrency(successReceipt.amount)}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Reference</span>
              <span className="font-mono font-bold text-slate-900">{successReceipt.referenceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-medium text-slate-800">{successReceipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary Payee</span>
              <span className="font-semibold text-slate-900">{successReceipt.beneficiaryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credited To A/c</span>
              <span className="font-mono font-medium text-slate-800">{successReceipt.beneficiaryAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Debited From A/c</span>
              <span className="font-mono font-medium text-slate-800">{successReceipt.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time</span>
              <span className="font-medium text-slate-800">{formatDate(successReceipt.date, true)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Remarks</span>
              <span className="font-medium text-slate-800">{successReceipt.remarks}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => navigate('/customer/transactions')}
              className="flex-1 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View in Transaction History
            </button>
            <button
              onClick={() => setSuccessReceipt(null)}
              className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              Make Another Transfer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TransferMoneyPage;
